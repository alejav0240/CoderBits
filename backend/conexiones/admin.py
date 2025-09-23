from django.contrib import admin
from .models import Conexion

@admin.register(Conexion)
class ConexionAdmin(admin.ModelAdmin):
    list_display = ['hora', 'ip_src', 'ip_dst', 'port_dst', 'etiqueta', 'confianza']
    list_filter = ['etiqueta', 'hora']
    search_fields = ['ip_src', 'ip_dst', 'etiqueta']