import pyshark
import tensorflow as tf
import joblib
import numpy as np
from collections import defaultdict
import time
import threading
import traceback
from typing import Optional
import asyncio
import sys

# =====================
# CONFIGURACIÓN
# =====================
INTERFACE = "Ethernet"
ROOT_PATH = "C:\\Users\\kiro\\CoderBits\\ML-Analisis\\"

MODEL_PATH = ROOT_PATH + "cic_ids2017_nn_model.h5"
SCALER_PATH = ROOT_PATH + "scaler_cic_ids2017.pkl"
ENCODER_PATH = ROOT_PATH + "label_encoder.pkl"

# =====================
# VARIABLES GLOBALES
# =====================
model = None
scaler = None
le = None
CLASS_NAMES = None

_capture: Optional[pyshark.LiveCapture] = None
_sniffer_thread: Optional[threading.Thread] = None
_stop_event = threading.Event()
_interface = INTERFACE

# =====================
# CARGA DE MODELO (LAZY)
# =====================
def cargar_modelo():
    global model, scaler, le, CLASS_NAMES
    if model is None:
        print("🔹 Cargando modelo y objetos...")
        model = tf.keras.models.load_model(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        le = joblib.load(ENCODER_PATH)
        CLASS_NAMES = le.classes_
        print(f"✅ Modelo cargado. Clases: {list(CLASS_NAMES)}")

# =====================
# CLASE FLOW
# =====================
class Flow:
    def __init__(self, src_ip, dst_ip, src_port, dst_port, protocol):
        self.src_ip = src_ip
        self.dst_ip = dst_ip
        self.src_port = src_port
        self.dst_port = dst_port
        self.protocol = protocol
        self.start_time = time.time()
        self.last_time = self.start_time
        self.fwd_pkts = []
        self.bwd_pkts = []
        self.flags = defaultdict(int)

    def add_packet(self, pkt, direction):
        now = float(pkt.sniff_timestamp)
        length = int(pkt.length)
        self.last_time = now

        if direction == "fwd":
            self.fwd_pkts.append((now, length))
        else:
            self.bwd_pkts.append((now, length))

        if hasattr(pkt, "tcp"):
            for flag in ["fin", "syn", "rst", "psh", "ack", "urg", "cwr", "ece"]:
                val = getattr(pkt.tcp, flag, None)
                if val == "1":
                    self.flags[flag.upper()] += 1

    def duration(self):
        return self.last_time - self.start_time

    def feature_vector(self):
        try:
            def safe_stat(lst, func, default=0):
                return func(lst) if lst else default

            fwd_lengths = [l for _, l in self.fwd_pkts]
            bwd_lengths = [l for _, l in self.bwd_pkts]
            fwd_times = [t for t, _ in self.fwd_pkts]
            bwd_times = [t for t, _ in self.bwd_pkts]

            total_fwd = len(fwd_lengths)
            total_bwd = len(bwd_lengths)
            flow_duration = self.duration()
            total_pkts = total_fwd + total_bwd
            total_bytes = sum(fwd_lengths) + sum(bwd_lengths)

            bytes_per_sec = total_bytes / flow_duration if flow_duration > 0 else 0
            pkts_per_sec = total_pkts / flow_duration if flow_duration > 0 else 0

            def iats(times):
                return [t2 - t1 for t1, t2 in zip(times[:-1], times[1:])] if len(times) > 1 else []

            flow_iats = iats(sorted(fwd_times + bwd_times))
            fwd_iats = iats(fwd_times)
            bwd_iats = iats(bwd_times)

            def iat_stats(lst):
                return [safe_stat(lst, np.mean), safe_stat(lst, np.std),
                        safe_stat(lst, np.max), safe_stat(lst, np.min), sum(lst)]

            flow_iat_mean, flow_iat_std, flow_iat_max, flow_iat_min, _ = iat_stats(flow_iats)
            fwd_iat_mean, fwd_iat_std, fwd_iat_max, fwd_iat_min, fwd_iat_total = iat_stats(fwd_iats)
            bwd_iat_mean, bwd_iat_std, bwd_iat_max, bwd_iat_min, bwd_iat_total = iat_stats(bwd_iats)

            all_lengths = fwd_lengths + bwd_lengths
            pkt_len_mean = safe_stat(all_lengths, np.mean)
            pkt_len_std = safe_stat(all_lengths, np.std)
            pkt_len_var = safe_stat(all_lengths, np.var)
            pkt_len_min = safe_stat(all_lengths, np.min)
            pkt_len_max = safe_stat(all_lengths, np.max)
            avg_pkt_size = pkt_len_mean

            fin = self.flags["FIN"]
            syn = self.flags["SYN"]
            rst = self.flags["RST"]
            psh = self.flags["PSH"]
            ack = self.flags["ACK"]
            urg = self.flags["URG"]
            cwe = self.flags["CWR"]
            ece = self.flags["ECE"]

            features = [
                pkts_per_sec, bytes_per_sec,
                total_fwd, flow_duration, int(self.dst_port),
                sum(fwd_lengths), total_bwd, sum(bwd_lengths),
                safe_stat(fwd_lengths, np.max), safe_stat(fwd_lengths, np.std),
                safe_stat(bwd_lengths, np.max), safe_stat(fwd_lengths, np.min),
                safe_stat(fwd_lengths, np.mean), safe_stat(bwd_lengths, np.mean),
                safe_stat(bwd_lengths, np.min), safe_stat(bwd_lengths, np.std),
                flow_iat_mean, flow_iat_std, flow_iat_max, flow_iat_min,
                fwd_iat_total, fwd_iat_mean, fwd_iat_std, fwd_iat_max, fwd_iat_min,
                bwd_iat_total, bwd_iat_mean, bwd_iat_std, bwd_iat_max, bwd_iat_min,
                0, 0,
                pkt_len_min, pkt_len_max, pkt_len_mean, pkt_len_std, pkt_len_var,
                fin, syn, rst, psh, ack, urg, cwe, ece,
                avg_pkt_size, safe_stat(fwd_lengths, np.mean), safe_stat(bwd_lengths, np.mean),
                0, 0, total_fwd, 0
            ]
            return np.array(features).reshape(1, -1)
        except Exception as e:
            print(f"⚠️ Error calculando features: {e}")
            return None

# =====================
# PREDICCIÓN
# =====================
def predecir(features):
    try:
        scaled = scaler.transform(features)
        y_pred = model.predict(scaled, verbose=0)
        clase = CLASS_NAMES[np.argmax(y_pred)]
        prob = np.max(y_pred)
        return clase, prob
    except Exception as e:
        print(f"⚠️ Error en predicción: {e}")
        return "ERROR", 0

# =====================
# FUNCIONES PARA DJANGO
# =====================
def _process_packet(packet):
    try:
        summary = getattr(packet, 'highest_layer', 'NO_LAYER')
        print(f"Paquete: {summary} - time: {getattr(packet, 'sniff_time', '')}")

        # Extraer datos del paquete y crear un Flow simple
        src_ip = getattr(packet.ip, 'src', None)
        dst_ip = getattr(packet.ip, 'dst', None)
        src_port = getattr(packet[packet.transport_layer], 'srcport', 0) if hasattr(packet, 'transport_layer') else 0
        dst_port = getattr(packet[packet.transport_layer], 'dstport', 0) if hasattr(packet, 'transport_layer') else 0
        proto = packet.transport_layer if hasattr(packet, 'transport_layer') else "NA"

        flow = Flow(src_ip, dst_ip, src_port, dst_port, proto)
        flow.add_packet(packet, "fwd")

        # Calcular features y predecir
        features = flow.feature_vector()
        if features is not None:
            clase, prob = predecir(features)
            if clase != "BENIGN":  # solo guardar si es ataque
                registrar_ataque(flow, clase, prob)

    except Exception:
        print("⚠️ Error al procesar paquete:")
        traceback.print_exc()


def _sniff_loop(capture: pyshark.LiveCapture):
    try:
        for packet in capture.sniff_continuously():
            if _stop_event.is_set():
                break
            _process_packet(packet)
    except Exception as e:
        print("⚠️ Error en sniff loop:", e)
        traceback.print_exc()
    finally:
        try:
            capture.close()
        except Exception:
            pass
        print("Sniffer: loop finalizado")

# =====================
# HILO DEL SNIFFER
# =====================
def _sniffer_target():
    global _capture
    try:
        cargar_modelo()
        print(f"🚀 Iniciando monitoreo en interfaz {_interface}")

        # --- FIX Windows: crear event loop explícito ---
        if sys.platform.startswith("win"):
            loop = asyncio.ProactorEventLoop()  # necesario para subprocess
            asyncio.set_event_loop(loop)
        else:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        _capture = pyshark.LiveCapture(interface=_interface, eventloop=loop)

        _sniff_loop(_capture)

    except Exception as e:
        print("⚠️ Error en sniffer thread:", e)
        traceback.print_exc()
    finally:
        print("🔚 Sniffer detenido")

# =====================
# START / STOP
# =====================
def start_sniffer(interface: str = INTERFACE):
    global _sniffer_thread, _stop_event, _interface
    if is_monitoring():
        print("El monitoreo ya está activo")
        return

    _stop_event.clear()
    _interface = interface

    _sniffer_thread = threading.Thread(target=_sniffer_target, daemon=True)
    _sniffer_thread.start()
    print(f"✅ Sniffer iniciado en hilo para interfaz {_interface}")

def stop_sniffer():
    global _capture, _sniffer_thread, _stop_event
    if not is_monitoring():
        print("El sniffer no estaba activo")
        return

    print("🛑 Deteniendo sniffer...")
    _stop_event.set()
    try:
        if _capture:
            _capture.close()
    except Exception as e:
        print(f"⚠️ Error cerrando capture: {e}")

    if _sniffer_thread:
        _sniffer_thread.join(timeout=5)

    _capture = None
    _sniffer_thread = None
    _stop_event.clear()
    print("✅ Sniffer detenido")

def is_monitoring() -> bool:
    return _sniffer_thread is not None and _sniffer_thread.is_alive()


from django.db import close_old_connections
from backend.ataques.models import Ataque
from backend.ataques.utils import enviar_alerta_ws
from django.utils import timezone
from backend.conexiones.monitoreo import IP_DISPOSITIVO_LOCAL

def registrar_ataque(flow: Flow, clase: str, prob: float):
    """
    Crea un Ataque en la DB y envía alerta si el flujo es malicioso.
    """
    ip_origen = flow.src_ip
    ip_destino = flow.dst_ip

    # Ignorar ataques desde la IP local
    if ip_origen == IP_DISPOSITIVO_LOCAL:
        return

    try:
        close_old_connections()
        ataque = Ataque.objects.create(
            ip_origen=ip_origen,
            ip_destino=ip_destino,
            tipo=clase,
            descripcion=f"Predicción ML: {clase} ({prob:.2f})",
            puerto=flow.dst_port,
            hora=timezone.now()
        )
        print(f"[monitoreo] Ataque registrado: {clase} {ip_origen} -> {ip_destino} prob={prob:.2f}")

        # Enviar alerta por WebSocket
        enviar_alerta_ws(ataque)

    except Exception as e:
        print(f"[monitoreo] Error guardando Ataque: {e}")