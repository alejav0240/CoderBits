from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/alertas/', consumers.AlertasConsumer.as_asgi()),
]