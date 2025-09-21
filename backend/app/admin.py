from django.contrib import admin
from .models import Rol, Personal, Conexion, Ataque, Mitigacion

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre_rol")
    search_fields = ("nombre_rol",)

@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "apellido", "usuario", "activo", "rol", "fecha_registro")
    search_fields = ("nombre", "apellido", "usuario", "correo")
    list_filter = ("activo", "rol")

@admin.register(Conexion)
class ConexionAdmin(admin.ModelAdmin):
    list_display = ("id", "hora", "ip_src", "ip_dst", "port_dst", "etiqueta", "confianza")
    search_fields = ("ip_src", "ip_dst", "etiqueta")
    list_filter = ("hora", "etiqueta")

@admin.register(Ataque)
class AtaqueAdmin(admin.ModelAdmin):
    list_display = ("id", "tipo", "descripcion", "ip_origen", "ip_destino", "puerto", "fecha_detectado", "conteo_conexiones", "activo")
    search_fields = ("tipo", "ip_origen", "ip_destino")
    list_filter = ("tipo", "activo", "fecha_detectado")

@admin.register(Mitigacion)
class MitigacionAdmin(admin.ModelAdmin):
    list_display = ("id", "ataque", "detalle", "ejecutado_por", "activo", "fecha_mitigacion", "resultado")
    search_fields = ("detalle", "resultado")
    list_filter = ("activo", "fecha_mitigacion", "resultado")
