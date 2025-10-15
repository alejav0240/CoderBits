import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AlertasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("alertas", self.channel_name)
        await self.accept()
        print("Cliente conectado al WebSocket de alertas")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("alertas", self.channel_name)
        print("Cliente desconectado de alertas")

    async def enviar_alerta(self, event):
        """Envía una alerta de ataque detectado al cliente"""
        await self.send(text_data=json.dumps(event["data"]))
