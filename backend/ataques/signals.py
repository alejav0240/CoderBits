from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Ataque
from mitigaciones.models import Mitigacion

@receiver(post_save, sender=Ataque)
def crear_mitigacion(sender, instance, created, **kwargs):
    """
    Crea un registro de mitigación para el ataque,
    pero no ejecuta ningún bloqueo automáticamente.
    """
    if not created:
        return  

    tipo = instance.tipo.lower()
    ip = instance.ip_origen or "desconocida"
    detalle = ""
    resultado = "Mitigación pendiente de activación manual"
    activo = False  # Por defecto, no activa

    if tipo in ["neptune", "ddos"]:
        detalle = f"Bloqueo recomendado por ataque tipo {tipo.upper()}"
    elif tipo == "satan":
        detalle = "Ataque tipo SATAN detectado — solo monitoreo"
    else:
        detalle = f"Ataque desconocido detectado ({tipo})"

    Mitigacion.objects.create(
        ataque=instance,
        detalle=detalle,
        activo=activo,
        resultado=resultado
    )

    print(f"🛡️ Mitigación registrada para {tipo.upper()} — pendiente de activación manual")
