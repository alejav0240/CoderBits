from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('roles.urls')),
    path('api/', include('personales.urls')),
    path('api/', include('conexiones.urls')),
    path('api/', include('ataques.urls')),
    path('api/', include('mitigaciones.urls')),
]