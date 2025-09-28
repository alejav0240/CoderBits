# conexiones/admin.py
from django.contrib import admin
from .models import Conexion
from .monitoreo import monitor_activo  # importamos la variable global
from django.http import HttpResponse

@admin.register(Conexion)
class ConexionAdmin(admin.ModelAdmin):
    list_display = ['hora', 'ip_src', 'ip_dst', 'port_dst', 'etiqueta', 'protocolo']
    list_filter = ['etiqueta', 'hora']
    search_fields = ['ip_src', 'ip_dst', 'etiqueta']

    actions = ['activar_monitoreo', 'desactivar_monitoreo']

    def activar_monitoreo(self, request, queryset):
        global monitor_activo
        monitor_activo = True
        self.message_user(request, "Monitoreo activado")
        return HttpResponse("Monitoreo activado")

    activar_monitoreo.short_description = "Activar monitoreo de red"

    def desactivar_monitoreo(self, request, queryset):
        global monitor_activo
        monitor_activo = False
        self.message_user(request, "Monitoreo desactivado")
        return HttpResponse("Monitoreo desactivado")

    desactivar_monitoreo.short_description = "Desactivar monitoreo de red"
