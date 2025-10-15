from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def enviar_alerta_ws(ataque):
    """Envía una alerta en tiempo real a todos los clientes WebSocket"""
    try:
        channel_layer = get_channel_layer()
        data = {
            "tipo": ataque.tipo,
            "descripcion": ataque.descripcion,
            "ip_origen": ataque.ip_origen,
            "ip_destino": ataque.ip_destino,
            "puerto": ataque.puerto,
            "fecha_detectado": str(ataque.fecha_detectado),
            "conteo_conexiones": ataque.conteo_conexiones,
        }
        async_to_sync(channel_layer.group_send)(
            "alertas",
            {
                "type": "enviar_alerta",
                "data": data,
            }
        )
        print(f"[alertas] Enviada alerta WS: {ataque.tipo} {ataque.ip_origen} → {ataque.ip_destino}")
    except Exception as e:
        print(f"[alertas] Error enviando alerta WebSocket: {e}")
