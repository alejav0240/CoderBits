from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from django.http import JsonResponse
from .models import BlacklistedToken

class BlacklistAccessTokenMiddleware(MiddlewareMixin):
    """
    Middleware para verificar si un access token JWT ha sido revocado.
    Si el token está en la lista negra, bloquea la petición.
    """
    def process_request(self, request):
        """
        Se ejecuta en cada request antes de que llegue a la vista.
        - Extrae el header Authorization.
        - Verifica si el token está en la tabla BlacklistedToken.
        - Devuelve 401 si el token ha sido revocado.
        """
        auth_header = request.headers.get("Authorization")  # Obtener header Authorization
        if auth_header and auth_header.startswith("Bearer "):  # Verificar que contenga "Bearer"
            token_str = auth_header.split(" ")[1]  # Extraer el token
            # Revisar si el token está en la lista negra
            if BlacklistedToken.objects.filter(token=token_str).exists():
                return JsonResponse({"error": "Access token revocado"}, status=401)
        return None  # Continuar con la request si no hay token revocado
