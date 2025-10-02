from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Ataque
from mitigaciones.models import Mitigacion

@receiver(post_save, sender=Ataque)
def crear_mitigacion(sender, instance, created, **kwargs):
    if not created:
        return  

    tipo = instance.tipo.lower()
    ip = instance.ip_origen or "desconocida"
    detalle = ""
    resultado = "Mitigación pendiente de activación manual"
    activo = False 

    if tipo in ["neptune", "ddos"]:
        detalle = f"Bloqueo recomendado por ataque tipo {tipo.upper()}"
    elif tipo == "satan":
        detalle = "Ataque tipo SATAN detectado — solo monitoreo"
    else:
        detalle = f"Ataque desconocido detectado ({tipo})"

    Mitigacion.objects.create(
        ataque=instance,
        ip=ip,
        detalle=detalle,
        activo=activo,
        resultado=resultado
    )

    print(f"[signals] Mitigación registrada para {tipo.upper()} — pendiente de activación manual")