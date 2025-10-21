import pyshark
import tensorflow as tf
import joblib
import numpy as np
from datetime import datetime
from collections import defaultdict
import time
import threading
import os
import sys

# =====================
# CONFIGURACIÓN GLOBAL
# =====================
INTERFACE = "Ethernet"  # Asegúrate de que esta interfaz sea correcta
FLOW_TIMEOUT = 10  # segundos de inactividad para cerrar un flujo

# Variables para control de estado y objetos globales
model = None
scaler = None
le = None
CLASS_NAMES = []
global_capture = None
stop_event = threading.Event() # Evento para señalizar la parada del hilo de sniffing

# Obtener la ruta absoluta del directorio ML_Analisis
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILENAME = "cic_ids2017_nn_model.h5"
SCALER_FILENAME = "scaler_cic_ids2017.pkl"
ENCODER_FILENAME = "label_encoder.pkl"

# Rutas correctas, absolutas y dinámicas
MODEL_PATH = os.path.join(BASE_DIR, MODEL_FILENAME)
SCALER_PATH = os.path.join(BASE_DIR, SCALER_FILENAME)
ENCODER_PATH = os.path.join(BASE_DIR, ENCODER_FILENAME)

# =====================
# FUNCIONES DE CARGA LAZY (SOLUCIÓN AL RUNTIMEERROR)
# =====================

def load_ml_objects():
    """Carga el modelo de ML y los objetos solo una vez."""
    global model, scaler, le, CLASS_NAMES
    if model is None:
        try:
            print(f"🔹 Cargando ML desde: {MODEL_PATH}")
            model = tf.keras.models.load_model(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            le = joblib.load(ENCODER_PATH)
            CLASS_NAMES = le.classes_
            print(f"✅ Modelo y objetos cargados. Clases: {list(CLASS_NAMES)}")
        except Exception as e:
            print(f"❌ Error al cargar modelo/objetos de ML. Verifique las rutas: {e}")
            sys.exit(1) # Detiene la ejecución si los archivos ML son críticos
    return model, scaler, le, CLASS_NAMES

# =====================
# ESTRUCTURA DE FLUJOS (CLASE Flow sin cambios)
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
        # Asegurarse de usar el tiempo del sistema si es necesario, pero
        # para features, la duración debe ser entre el primer y último paquete capturado.
        return self.last_time - self.start_time

    def set_last_time(self):
        # Esta función debe ser actualizada para usar el timestamp del paquete
        # o el tiempo actual del sistema si se usa para timeout de inactividad
        self.last_time = time.time() 

    def feature_vector(self):
        """Calcula las 52 features esperadas por el modelo"""
        # (El resto de la implementación de feature_vector se mantiene igual por brevedad)
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
    global model, scaler, le, CLASS_NAMES
    # Garantiza que el modelo está cargado antes de predecir
    if model is None:
        load_ml_objects() 
        
    try:
        scaled = scaler.transform(features)
        y_pred = model.predict(scaled)
        clase = CLASS_NAMES[np.argmax(y_pred)]
        prob = np.max(y_pred)
        return clase, prob
    except Exception as e:
        print(f"⚠️ Error en predicción: {e}")
        return "ERROR", 0



import asyncio
# =====================
# MONITOREO EN HILO (Ejecución principal CORREGIDA)
# =====================
def run_traffic_monitor(attack_callback, connection_callback, ip_local):
    """
    Función que ejecuta el bucle de captura de tráfico y detección de ML.
    Se ejecuta en un hilo separado.
    """
    global global_capture, stop_event
    flows = {}
    loop = None

    # ------------------------------------------------------------------
    # 📌 PASO CLAVE: Inicializar el Event Loop para el Hilo Actual (Soluciona RuntimeError)
    # ------------------------------------------------------------------
    try:
        # Crea un nuevo event loop de asyncio
        loop = asyncio.new_event_loop()
        # Establece este loop como el loop actual para este hilo
        asyncio.set_event_loop(loop)
    except Exception as e:
        print(f"❌ Error al inicializar asyncio loop: {e}")
        stop_event.set()
        return

    # 1. Cargar objetos de ML (Lazy)
    load_ml_objects()
    
    # 2. Inicializar PyShark
    try:
        print(f"\n🚀 Inicializando LiveCapture en interfaz {INTERFACE}...")
        # PyShark ahora encuentra el event loop que acabamos de crear
        global_capture = pyshark.LiveCapture(interface=INTERFACE, eventloop=loop)    
        print("✅ PyShark LiveCapture inicializado.")
    except Exception as e:
        print(f"❌ Error al inicializar pyshark: {e}. ¿Permisos de red?")
        stop_event.set()
        # Nota: PyShark puede tardar un poco en liberar recursos si falla aquí
        return

    # 3. Bucle de Captura
    try:
        for pkt in global_capture.sniff_continuously():
            # Verifica si se ha solicitado la parada
            if stop_event.is_set():
                break 

            if not hasattr(pkt, "ip") or not hasattr(pkt, "transport_layer"):
                continue

            # Extracción de campos y callbacks
            try:
                src_ip = pkt.ip.src
                dst_ip = pkt.ip.dst
                src_port = pkt[pkt.transport_layer].srcport
                dst_port = pkt[pkt.transport_layer].dstport
                protocol = pkt.transport_layer
                # Se utiliza el timestamp del paquete
                timestamp = datetime.fromtimestamp(float(pkt.sniff_timestamp)) 
            except AttributeError:
                continue 

            # Registro de Conexión (Callback a monitoreo.py)
            connection_callback(src_ip, dst_ip, dst_port, protocol, timestamp)

            # Análisis ML (Flujos)
            key_fwd = (src_ip, dst_ip, src_port, dst_port, protocol)
            key_bwd = (dst_ip, src_ip, dst_port, src_port, protocol)

            flow = flows.get(key_fwd) or flows.get(key_bwd)
            
            if flow:
                direction = "fwd" if key_fwd in flows else "bwd"
                # Actualiza el tiempo de última actividad para el timeout
                flow.set_last_time() 
            else:
                flow = Flow(src_ip, dst_ip, src_port, dst_port, protocol)
                flows[key_fwd] = flow
                direction = "fwd"
            
            flow.add_packet(pkt, direction)

            # Proceso de Flujos Inactivos (basado en el tiempo de sistema)
            # Nota: flow.last_time se actualiza con el timestamp del paquete, 
            # pero el timeout se basa en el tiempo del sistema (time.time()) para saber la inactividad real.
            if time.time() - flow.last_time > FLOW_TIMEOUT:
                features = flow.feature_vector()
                
                if features is not None:
                    clase, prob = predecir(features)
                    
                    if clase != "BENIGN":
                        # Creación de Ataque (Callback a monitoreo.py)
                        if src_ip != ip_local: 
                            attack_callback(src_ip, dst_ip, clase, f"ML-Detección: {clase} ({prob:.2f})")
                        
                # Eliminar flujos
                if key_fwd in flows:
                    del flows[key_fwd]
                if key_bwd in flows:
                    del flows[key_bwd]

    except Exception as e:
        if not stop_event.is_set():
             # ASEGÚRATE DE QUE SE IMPRIMA EL ERROR (e)
             print(f"⚠️ Error en el bucle de monitoreo: {e}")
    finally:
        # Limpieza
        if global_capture:
            global_capture.close()
            global_capture = None
        
        if loop:
            # Cierra el event loop al finalizar el hilo
            loop.close()
            
        print("✅ Monitoreo de ML detenido.")


def start_ml_monitoring(attack_callback, connection_callback, ip_local):
    """Inicia el monitoreo de ML en un hilo separado."""
    global stop_event
    if stop_event.is_set():
        # Reiniciar el evento si estaba parado
        stop_event.clear()
        
    thread = threading.Thread(target=run_traffic_monitor, 
                              args=(attack_callback, connection_callback, ip_local), 
                              daemon=True)
    thread.start()
    print("[monitoreo] Hilo de ML iniciado.")


def stop_ml_monitoring():
    """Detiene la captura de pyshark."""
    global stop_event, global_capture
    
    # 1. Señaliza la parada en el hilo
    stop_event.set()
    print("[monitoreo] Señal de parada enviada al hilo de ML.")
    
    if global_capture:
        global_capture.close()
        global_capture = None