from django.urls import path
from . import consumers

websocket_urlpatterns = [
    # Define un endpoint WebSocket en la URL 'ws/monitoreo/'
    # Cada conexión a esta URL será manejada por MonitorConsumer
    path("ws/monitoreo/", consumers.MonitorConsumer.as_asgi()),
]
