import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MonitorConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer para monitoreo en tiempo real.
    Permite enviar datos a todos los clientes conectados al grupo "monitoreo".
    """

    async def connect(self):
        """
        Se ejecuta cuando un cliente intenta conectarse al WebSocket.
        - Lo agrega al grupo "monitoreo" para recibir mensajes broadcast.
        - Acepta la conexión.
        """
        await self.channel_layer.group_add("monitoreo", self.channel_name)
        await self.accept()
        print("Cliente conectado al WebSocket")

    async def disconnect(self, close_code):
        """
        Se ejecuta cuando un cliente se desconecta del WebSocket.
        - Lo elimina del grupo "monitoreo".
        - close_code indica el motivo de la desconexión.
        """
        await self.channel_layer.group_discard("monitoreo", self.channel_name)
        print("Cliente desconectado")

    async def enviar_datos(self, event):
        """
        Se ejecuta cuando se recibe un evento enviado al grupo "monitoreo".
        - Envía los datos al cliente en formato JSON.
        - 'event["data"]' contiene el payload que se quiere transmitir.
        """
        await self.send(text_data=json.dumps(event["data"]))
