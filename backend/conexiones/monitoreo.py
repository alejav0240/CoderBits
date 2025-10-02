# conexiones/monitoreo.py
from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP, ICMP
from scapy.layers.inet6 import IPv6
from scapy.layers.l2 import ARP
from django.utils import timezone
from .models import Conexion
import threading
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

monitor_activo = True  
sniffer_iniciado = False

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
    if not monitor_activo:
        return

    ip_origen = get_field(packet, IP, "src") or get_field(packet, IPv6, "src")
    ip_destino = get_field(packet, IP, "dst") or get_field(packet, IPv6, "dst")
    puerto_destino = get_field(packet, TCP, "dport") or get_field(packet, UDP, "dport")
    etiqueta = packet.lastlayer().name
    protocolo = get_proto(packet)
    timestamp = timezone.now()

    if ip_origen in [None, "-"] or ip_destino in [None, "-"]:
        return 

    conexion = Conexion.objects.create(
        hora=timestamp,
        ip_src=ip_origen,
        ip_dst=ip_destino,
        port_dst=puerto_destino,
        etiqueta=etiqueta,
        protocolo=protocolo
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "monitoreo",
        {
            "type": "enviar_datos",
            "data": {
                "hora": str(conexion.hora),
                "ip_src": conexion.ip_src,
                "ip_dst": conexion.ip_dst,
                "port_dst": conexion.port_dst,
                "etiqueta": conexion.etiqueta,
                "protocolo": conexion.protocolo,
            },
        }
    )

def start_sniffer():
    """Inicia la captura en un hilo separado solo una vez"""
    global sniffer_iniciado
    global monitor_activo

    if sniffer_iniciado:
        return
    sniffer_iniciado = True

    def run():
        print("Captura de red iniciada")
        while True:
            try:
                sniff(prn=packet_callback, store=False, timeout=5)
            except Exception as e:
                print("Error en Sniffer:", e)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
