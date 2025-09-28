from django.apps import AppConfig
import threading

class ConexionesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'conexiones'

    def ready(self):
        from .monitoreo import start_sniffer
        start_sniffer()
