import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import conexiones.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_api_django.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(conexiones.routing.websocket_urlpatterns)
    ),
})
