# conexiones/monitoreo.py
import threading
import collections
import time
import json
import platform
from urllib import request, error
from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP
from scapy.layers.inet6 import IPv6
from scapy.layers.l2 import ARP
from django.utils import timezone
from django.db import close_old_connections
from .models import Conexion

monitor_activo = True
sniffer_iniciado = False

SYN_WINDOW_SECONDS = 5
SYN_THRESHOLD = 20

PKT_WINDOW_SECONDS = 5
PKT_THRESHOLD = 200

PORTSCAN_WINDOW_SECONDS = 10
PORTSCAN_PORTS_THRESHOLD = 15

# estructuras de contador
syn_records = {}       # ip -> deque(timestamps)
pkt_records = {}       # ip -> deque(timestamps)
portscan_records = {}  # ip -> {port: last_ts}

API_URL = "http://127.0.0.1:8000/api/ataques/" 
API_HEADERS = {"Content-Type": "application/json"}

# helpers
def trim_deque(dq, window_seconds):
    cutoff = time.time() - window_seconds
    while dq and dq[0] < cutoff:
        dq.popleft()

def post_attack_to_api(payload):
    """Envía el payload a la API en un thread separado (no bloquear sniffer)."""
    def _post():
        try:
            data = json.dumps(payload).encode("utf-8")
            req = request.Request(API_URL, data=data, headers=API_HEADERS, method="POST")
            with request.urlopen(req, timeout=5) as resp:
                resp_body = resp.read().decode("utf-8")
                print(f"[monitoreo->API] {resp.status} -> {resp_body}")
        except error.HTTPError as e:
            try:
                body = e.read().decode("utf-8")
            except Exception:
                body = ""
            print(f"[monitoreo->API] HTTPError {e.code}: {body}")
        except Exception as e:
            print(f"[monitoreo->API] Error enviando a API: {e}")
    t = threading.Thread(target=_post, daemon=True)
    t.start()

def crear_evento_ataque(ip_origen, ip_destino, tipo, descripcion="Detectado por sniffer"):
    payload = {
        "tipo": tipo,
        "descripcion": descripcion,
        "ip_origen": ip_origen,
        "ip_destino": ip_destino,
        "puerto": None
    }
    print(f"[monitoreo] Enviando ataque a API: {payload}")
    post_attack_to_api(payload)

def evaluar_y_emitir(ip_origen, ip_destino):
    now = time.time()

    # SYN / Neptune
    dq_syn = syn_records.get(ip_origen)
    if dq_syn:
        trim_deque(dq_syn, SYN_WINDOW_SECONDS)
        if len(dq_syn) >= SYN_THRESHOLD:
            crear_evento_ataque(ip_origen, ip_destino, "Neptune", f"{len(dq_syn)} SYNs en {SYN_WINDOW_SECONDS}s")
            dq_syn.clear()

    # Packet rate -> DDoS
    dq_pkt = pkt_records.get(ip_origen)
    if dq_pkt:
        trim_deque(dq_pkt, PKT_WINDOW_SECONDS)
        if len(dq_pkt) >= PKT_THRESHOLD:
            crear_evento_ataque(ip_origen, ip_destino, "DDoS", f"{len(dq_pkt)} pkts en {PKT_WINDOW_SECONDS}s")
            dq_pkt.clear()

    # Port scan -> SATAN
    ports = portscan_records.get(ip_origen)
    if ports:
        cutoff = now - PORTSCAN_WINDOW_SECONDS
        recent_ports = {p: t for p, t in ports.items() if t >= cutoff}
        portscan_records[ip_origen] = recent_ports
        if len(recent_ports) >= PORTSCAN_PORTS_THRESHOLD:
            crear_evento_ataque(ip_origen, ip_destino, "Satan", f"{len(recent_ports)} puertos en {PORTSCAN_WINDOW_SECONDS}s")
            portscan_records[ip_origen] = {}

def get_field(packet, layer, field):
    if packet.haslayer(layer):
        return getattr(packet[layer], field, "-")
    return "-"

def get_proto(packet):
    for layer in [TCP, UDP, IPv6, IP, ARP]:
        if packet.haslayer(layer):
            return layer.__name__
    return packet.lastlayer().name

def packet_callback(packet):
    if not monitor_activo:
        return

    # Extraer IPs/puerto/proto/etiqueta
    ip_origen = get_field(packet, IP, "src") or get_field(packet, IPv6, "src")
    ip_destino = get_field(packet, IP, "dst") or get_field(packet, IPv6, "dst")
    puerto_destino = get_field(packet, TCP, "dport") or get_field(packet, UDP, "dport")
    etiqueta = packet.lastlayer().name
    protocolo = get_proto(packet)
    timestamp = timezone.now()

    if ip_origen in [None, "-"] or ip_destino in [None, "-"]:
        return

    try:
        close_old_connections()
        Conexion.objects.create(
            hora=timestamp,
            ip_src=ip_origen,
            ip_dst=ip_destino,
            port_dst=(None if puerto_destino in [None, "-", ""] else puerto_destino),
            etiqueta=etiqueta,
            protocolo=protocolo
        )
    except Exception as e:
        print("[monitoreo] Error guardando Conexion:", e)

    now = time.time()

    # actualizar contadores de tasa
    dq_pkt = pkt_records.setdefault(ip_origen, collections.deque())
    dq_pkt.append(now)

    # SYN detection
    if packet.haslayer(TCP):
        try:
            flags = int(packet[TCP].flags)
            if flags & 0x02:  # SYN
                dq_syn = syn_records.setdefault(ip_origen, collections.deque())
                dq_syn.append(now)
        except Exception:
            pass

    # Port-scan detection
    try:
        if puerto_destino not in [None, "-", ""]:
            ports = portscan_records.setdefault(ip_origen, {})
            ports[int(puerto_destino)] = now
    except Exception:
        pass

    # evaluar patrones y enviar a API si aplica
    evaluar_y_emitir(ip_origen, ip_destino)

def start_sniffer():
    """Inicia la captura en un hilo separado solo una vez"""
    global sniffer_iniciado
    if sniffer_iniciado:
        return
    sniffer_iniciado = True

    def run():
        print("Captura de red iniciada (sniffer -> API)")
        while True:
            try:
                sniff(prn=packet_callback, store=False, timeout=5)
            except Exception as e:
                print("[monitoreo] Error en Sniffer:", e)
                time.sleep(1)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
