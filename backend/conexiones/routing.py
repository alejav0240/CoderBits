from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/monitoreo/", consumers.MonitorConsumer.as_asgi()),
]
