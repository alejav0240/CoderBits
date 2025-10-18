from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView

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