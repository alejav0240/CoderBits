from django.contrib import admin
from .models import Personal

@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'correo', 'usuario', 'activo')
    search_fields = ('nombre', 'apellido', 'correo')
    list_filter = ('activo', 'rol')

    actions = ['borrado_logico_seleccionados', 'restaurar_seleccionados']

    def get_actions(self, request):
        # Obtiene las acciones por defecto
        actions = super().get_actions(request)
        # Elimina la acción de borrado por defecto
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def borrado_logico_seleccionados(self, request, queryset):
        for obj in queryset:
            obj.delete()
        
        self.message_user(request, f"{len(queryset)} usuarios fueron borrados lógicamente.")

    borrado_logico_seleccionados.short_description = "Borrar lógicamente a los usuarios seleccionados"

    def restaurar_seleccionados(self, request, queryset):
        restaurados_count = queryset.update(activo=True)
        self.message_user(request, f"{restaurados_count} usuarios fueron restaurados exitosamente.")

    restaurar_seleccionados.short_description = "Restaurar usuarios seleccionados"