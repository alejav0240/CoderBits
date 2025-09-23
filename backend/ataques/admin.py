from django.contrib import admin
from .models import Ataque

@admin.register(Ataque)
class AtaqueAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'ip_origen', 'ip_destino', 'activo', 'fecha_detectado')
    search_fields = ('tipo', 'ip_origen', 'ip_destino')
    list_filter = ('activo',)
    
    actions = ['borrado_logico_seleccionados', 'restaurar_seleccionados']

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def borrado_logico_seleccionados(self, request, queryset):
        for obj in queryset:
            obj.delete()
        self.message_user(request, f"{len(queryset)} ataques fueron borrados lógicamente.")
    borrado_logico_seleccionados.short_description = "Borrar lógicamente a los ataques seleccionados"

    def restaurar_seleccionados(self, request, queryset):
        restaurados_count = queryset.update(activo=True)
        self.message_user(request, f"{restaurados_count} ataques fueron restaurados exitosamente.")
    restaurar_seleccionados.short_description = "Restaurar ataques seleccionados"