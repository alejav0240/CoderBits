import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MonitorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("monitoreo", self.channel_name)
        await self.accept()
        print("Cliente conectado al WebSocket")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("monitoreo", self.channel_name)
        print("Cliente desconectado")

    async def enviar_datos(self, event):
        await self.send(text_data=json.dumps(event["data"]))
