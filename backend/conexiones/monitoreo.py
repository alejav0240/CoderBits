import threading
import collections
import time
from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP, ICMP
from scapy.layers.inet6 import IPv6
from scapy.layers.l2 import ARP
from django.utils import timezone
from django.db import close_old_connections
from .models import Conexion
from ataques.models import Ataque
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

monitor_activo_event = threading.Event()  
sniffer_iniciado = False

SYN_WINDOW_SECONDS = 5
SYN_THRESHOLD = 20

PKT_WINDOW_SECONDS = 5
PKT_THRESHOLD = 200

PORTSCAN_WINDOW_SECONDS = 10
PORTSCAN_PORTS_THRESHOLD = 15

syn_records = {}      
pkt_records = {}       
portscan_records = {} 


def trim_deque(dq, window_seconds):
    cutoff = time.time() - window_seconds
    while dq and dq[0] < cutoff:
        dq.popleft()


def crear_evento_ataque(ip_origen, ip_destino, tipo, descripcion="Detectado por sniffer"):
    try:
        close_old_connections()
        Ataque.objects.create(
            ip_origen=ip_origen,
            ip_destino=ip_destino,
            tipo=tipo,
            descripcion=descripcion,
            puerto=None,
        )
        print(f"[monitoreo] Ataque registrado: {tipo} {ip_origen} -> {ip_destino}")
    except Exception as e:
        print(f"[monitoreo] Error guardando Ataque: {e}")

def evaluar_y_emitir(ip_origen, ip_destino):
    now = time.time()

    dq_syn = syn_records.get(ip_origen)
    if dq_syn:
        trim_deque(dq_syn, SYN_WINDOW_SECONDS)
        if len(dq_syn) >= SYN_THRESHOLD:
            crear_evento_ataque(ip_origen, ip_destino, "Neptune", f"{len(dq_syn)} SYNs en {SYN_WINDOW_SECONDS}s")
            dq_syn.clear()

    dq_pkt = pkt_records.get(ip_origen)
    if dq_pkt:
        trim_deque(dq_pkt, PKT_WINDOW_SECONDS)
        if len(dq_pkt) >= PKT_THRESHOLD:
            crear_evento_ataque(ip_origen, ip_destino, "DDoS", f"{len(dq_pkt)} pkts en {PKT_WINDOW_SECONDS}s")
            dq_pkt.clear()

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
    for layer in [TCP, UDP, ICMP, ARP, IPv6, IP]:
        if packet.haslayer(layer):
            return layer.__name__
    return packet.lastlayer().name


def packet_callback(packet):
    if not monitor_activo_event.is_set():
        return

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
            port_dst=(None if puerto_destino in [None, "-", ""] else puerto_destino), # <--- Aquí se genera el None
            etiqueta=etiqueta,
            protocolo=protocolo
        )

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "monitoreo",
            {
                "type": "enviar_datos",
                "data": {
                    "tipo_evento": "conexion",
                    "conexion": {
                        "ip_src": ip_origen,
                        "ip_dst": ip_destino,
                        "port_dst": puerto_destino if puerto_destino not in [None, "-", ""] else None,
                        "protocolo": protocolo,
                        "timestamp": timestamp.isoformat(),
                    }
                }
            }
        )
    except Exception as e:
        print("[monitoreo] Error guardando Conexion:", e)

    now = time.time()

    dq_pkt = pkt_records.setdefault(ip_origen, collections.deque())
    dq_pkt.append(now)

    if packet.haslayer(TCP):
        try:
            flags = int(packet[TCP].flags)
            if flags & 0x02:  
                dq_syn = syn_records.setdefault(ip_origen, collections.deque())
                dq_syn.append(now)
        except Exception:
            pass

    try:
        if puerto_destino not in [None, "-", ""]:
            ports = portscan_records.setdefault(ip_origen, {})
            ports[int(puerto_destino)] = now
    except Exception:
        pass

    evaluar_y_emitir(ip_origen, ip_destino)


def start_sniffer():
    """Inicia la captura en un hilo separado solo una vez"""
    global sniffer_iniciado
    if sniffer_iniciado:
        monitor_activo_event.set()  
        return
    sniffer_iniciado = True

    def run():
        print("[monitoreo] Captura de red iniciada")
        while True:
            try:
                sniff(prn=packet_callback, store=False, timeout=5)
            except Exception as e:
                print("[monitoreo] Error en Sniffer:", e)
                time.sleep(1)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()


def stop_sniffer():
    """Desactiva temporalmente el monitoreo sin matar el hilo"""
    monitor_activo_event.clear()
    print("[monitoreo] Monitoreo pausado")
