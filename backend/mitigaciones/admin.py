from django.contrib import admin
from .models import Mitigacion

@admin.register(Mitigacion)
class MitigacionAdmin(admin.ModelAdmin):
    list_display = ('ataque', 'ejecutado_por', 'activo', 'fecha_mitigacion')
    search_fields = ('detalle', 'ataque__tipo', 'ejecutado_por__nombre')
    list_filter = ('activo', 'resultado')

    actions = ['borrado_logico_seleccionadas', 'restaurar_seleccionadas']

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def borrado_logico_seleccionadas(self, request, queryset):
        for obj in queryset:
            obj.delete()
        self.message_user(request, f"{len(queryset)} mitigaciones fueron borradas lógicamente.")
    borrado_logico_seleccionadas.short_description = "Borrar lógicamente a las mitigaciones seleccionadas"

    def restaurar_seleccionadas(self, request, queryset):
        restauradas_count = queryset.update(activo=True)
        self.message_user(request, f"{restauradas_count} mitigaciones fueron restauradas exitosamente.")
    restaurar_seleccionadas.short_description = "Restaurar mitigaciones seleccionadas"