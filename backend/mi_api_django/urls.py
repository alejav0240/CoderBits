from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'API de CoderBits funcionando correctamente',
        'endpoints': {
            'api/': 'Endpoints principales',
            'admin/': 'Panel de administración'
        }
    })

urlpatterns = [
    # 1. Ruta para el archivo de esquema (JSON/YAML) - NECESARIO para ambas UIs
    path('api/docu/', SpectacularAPIView.as_view(), name='schema'),
    
    # 2. Ruta para la interfaz de Swagger UI
    path('api/docu/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # 3. Ruta para la interfaz de ReDoc - ¡Esta es la nueva!
    path('api/docu/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('roles.urls')),
    path('api/', include('personales.urls')),
    path('api/', include('conexiones.urls')),
    path('api/', include('ataques.urls')),
    path('api/', include('mitigaciones.urls')),
    path('api/', include('dashboard.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]