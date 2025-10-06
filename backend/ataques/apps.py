from django.apps import AppConfig

class AtaquesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ataques'

    def ready(self):
        """Importa los signals cuando la app esté lista"""
        import ataques.signals