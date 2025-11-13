from django.urls import path
from . import consumers 

# Lista de rutas de WebSocket para la app
websocket_urlpatterns = [
    # Define un endpoint WebSocket en la URL 'ws/alertas/'
    path('ws/alertas/', consumers.AlertasConsumer.as_asgi()),
]
