import pyshark
import tensorflow as tf
import joblib
import numpy as np
from datetime import datetime
from collections import defaultdict
import time
import signal
import sys

# =====================
# CONFIGURACIÓN
# =====================
INTERFACE = "Wi-Fi"  # Cambia según tu sistema: "Ethernet", "wlan0", etc.
ROOT_PATH = "C:\\Proyectos\\CoderBits\\ML-Analisis\\"
MODEL_PATH = ROOT_PATH + "cic_ids2017_nn_model.h5"
SCALER_PATH = ROOT_PATH + "scaler_cic_ids2017.pkl"
ENCODER_PATH = ROOT_PATH + "label_encoder.pkl"
FLOW_TIMEOUT = 10  # segundos de inactividad para cerrar un flujo

# =====================
# CARGA DE MODELO Y OBJETOS
# =====================
print("🔹 Cargando modelo y objetos...")
model = tf.keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
le = joblib.load(ENCODER_PATH)
CLASS_NAMES = le.classes_
print(f"✅ Modelo cargado. Clases detectadas: {list(CLASS_NAMES)}")

# =====================
# ESTRUCTURA DE FLUJOS
# =====================
class Flow:
    def __init__(self, src_ip, dst_ip, src_port, dst_port, protocol):
        self.src_ip = src_ip
        self.dst_ip = dst_ip
        self.src_port = src_port
        self.dst_port = dst_port
        self.protocol = protocol
        self.start_time = time.time()
        self.last_time = None
        self.fwd_pkts = []
        self.bwd_pkts = []
        self.flags = defaultdict(int)

    def add_packet(self, pkt, direction):
        #print(f"Analizando paquete desde add_packet de {pkt}...")
        now = float(pkt.sniff_timestamp)
        print(f"Timestamp del paquete: -----------------------------{now}")
        length = int(pkt.length)
        print(f"Actualizando last_time de {self.last_time} a {now}...")
        self.last_time = now
        if direction == "fwd":
            self.fwd_pkts.append((now, length))
        else:
            self.bwd_pkts.append((now, length))

        # Contar flags TCP si existen
        if hasattr(pkt, "tcp"):
            for flag in ["fin", "syn", "rst", "psh", "ack", "urg", "cwr", "ece"]:
                val = getattr(pkt.tcp, flag, None)
                if val == "1":
                    self.flags[flag.upper()] += 1

    def duration(self):
        return self.last_time - self.start_time

    def set_last_time(self):
        print(f"Actualizando last_time de {self.last_time} a {time.time()}...")
        self.last_time = time.time()

    def feature_vector(self):
        """Calcula las 52 features esperadas por el modelo"""
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
                0, 0,  # Fwd/Bwd Header Length (no disponible)
                pkt_len_min, pkt_len_max, pkt_len_mean, pkt_len_std, pkt_len_var,
                fin, syn, rst, psh, ack, urg, cwe, ece,
                avg_pkt_size, safe_stat(fwd_lengths, np.mean), safe_stat(bwd_lengths, np.mean),
                0, 0, total_fwd, 0  # placeholders para mantener 52 features
            ]
            return np.array(features).reshape(1, -1)
        except Exception as e:
            print(f"⚠️ Error calculando features: {e}")
            return None


# =====================
# FUNCIÓN DE PREDICCIÓN
# =====================
def predecir(features):
    try:
        scaled = scaler.transform(features)
        y_pred = model.predict(scaled)
        clase = CLASS_NAMES[np.argmax(y_pred)]
        prob = np.max(y_pred)
        return clase, prob
    except Exception as e:
        print(f"⚠️ Error en predicción: {e}")
        return "ERROR", 0


# =====================
# MONITOREO PRINCIPAL
# =====================
flows = {}
print(f"\n🚀 Iniciando monitoreo en interfaz {INTERFACE} (Ctrl+C para detener)\n")
capture = pyshark.LiveCapture(interface=INTERFACE)

def salir(sig, frame):
    print("\n🛑 Monitoreo detenido por el usuario.")
    sys.exit(0)

signal.signal(signal.SIGINT, salir)

for pkt in capture.sniff_continuously():
    try:
        if not hasattr(pkt, "ip") or not hasattr(pkt, "transport_layer"):
            continue

        src_ip = pkt.ip.src
        #print(f"Analizando paquete de {src_ip}...")
        dst_ip = pkt.ip.dst
        #print(f"Analizando paquete a {dst_ip}...")
        src_port = pkt[pkt.transport_layer].srcport
        #print(f"Puerto origen: {src_port}")
        dst_port = pkt[pkt.transport_layer].dstport
        #print(f"Puerto destino: {dst_port}")
        protocol = pkt.transport_layer
        #print(f"Protocolo: {protocol}")

        key_fwd = (src_ip, dst_ip, src_port, dst_port, protocol)
        #print(f"Clave flujo forward: {key_fwd}")
        key_bwd = (dst_ip, src_ip, dst_port, src_port, protocol)
        #print(f"Clave flujo backward: {key_bwd}")

        if key_fwd in flows:
            direction = "fwd"
            flow = flows[key_fwd]
            flow.set_last_time()
            #print("Flujo existente en dirección forward.")
        elif key_bwd in flows:
            direction = "bwd"
            flow = flows[key_bwd]
            flow.set_last_time()
            #print("Flujo existente en dirección backward.")
        else:
            flow = Flow(src_ip, dst_ip, src_port, dst_port, protocol)
            #print("***********************************************************************************************************************************Creando nuevo flujo...")
            #print(f"flow: {vars(flow)}")
            flows[key_fwd] = flow
            direction = "fwd"
            print("Nuevo flujo creado.")

        flow.add_packet(pkt, direction)
        #print(f"Paquete añadido al flujo en dirección {direction}.")

        # Si el flujo está inactivo, procesar
        #print("Verificando inactividad del time.time()... ------------------------------------------------------------",time.time())
        #print("Verificando inactividad del FLOW_TIMEOUT... -------------------------------------------------------------", FLOW_TIMEOUT)
        #print("Verificando inactividad del flow.last_time... -------------------------------------------------------------",flow.last_time)
        #print("Verificando inactividad del flow.start_time... -------------------------------------------------------------",flow.start_time)
        #print("Verificando inactividad del time.time() - flow.last_time... -------------------------------------------------------------",time.time() - flow.last_time)
        #print("Verificando inactividad del time.time() - flow.start_time... -------------------------------------------------------------",time.time() - flow.start_time)
        print("Verificando inactividad del time.time() - flow.last_time > FLOW_TIMEOU... ------------------------------------------------------------",time.time() - flow.start_time > FLOW_TIMEOUT)
        if time.time() - flow.start_time > FLOW_TIMEOUT:
            print(f"-----------------------------------------------------------------------------Flujo inactivo detectado: {flow.src_ip} ➜ {flow.dst_ip}")
            features = flow.feature_vector()
            print(f"Vector de características calculado: {features}")
            if features is not None:
                print("------------------------------------------------------------------------------------------------------------------------------Realizando predicción...")
                clase, prob = predecir(features)
                print(f"---------------------------------------------------------------------------------------Predicción realizada: {clase} con probabilidad {prob:.2f}")
                if clase != "BENIGN":
                    print(f"🚨 [{datetime.now().strftime('%H:%M:%S')}] {flow.src_ip} ➜ {flow.dst_ip}  [{clase}] ({prob:.2f})")
            del flows[key_fwd]
    except Exception as e:
        print(f"⚠️ Error procesando paquete: {e}")
