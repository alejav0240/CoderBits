from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from django.http import JsonResponse
from .models import BlacklistedToken

class BlacklistAccessTokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token_str = auth_header.split(" ")[1]
            if BlacklistedToken.objects.filter(token=token_str).exists():
                return JsonResponse({"error": "Access token revocado"}, status=401)
        return None
