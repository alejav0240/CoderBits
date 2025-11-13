from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Ataque
from mitigaciones.models import Mitigacion

# -----------------------------
# Signal receiver: se ejecuta después de guardar un Ataque
# -----------------------------
@receiver(post_save, sender=Ataque)
def crear_mitigacion(sender, instance, created, **kwargs):
    """
    Crea automáticamente un registro de Mitigación cuando se detecta un nuevo Ataque.
    
    Parámetros:
    - sender: modelo que envía la señal (Ataque)
    - instance: instancia del Ataque que se acaba de guardar
    - created: booleano que indica si la instancia fue recién creada
    """

    # Si el Ataque ya existía, no hacemos nada
    if not created:
        return  

    # Datos básicos de la mitigación
    tipo = instance.tipo.lower()            # Tipo de ataque en minúsculas
    ip = instance.ip_origen or "desconocida"  # IP origen del ataque
    detalle = ""                             # Descripción detallada
    resultado = "Mitigación pendiente de activación manual"  # Estado inicial
    activo = False                           # Mitigación inicialmente inactiva

    # Generar detalle según el tipo de ataque
    if tipo in ["neptune", "ddos"]:
        detalle = f"Bloqueo recomendado por ataque tipo {tipo.upper()}"
    elif tipo == "satan":
        detalle = "Ataque tipo SATAN detectado — solo monitoreo"
    else:
        detalle = f"Ataque desconocido detectado ({tipo})"

    # Crear registro de Mitigación en la base de datos
    Mitigacion.objects.create(
        ataque=instance,
        ip=ip,
        detalle=detalle,
        activo=activo,
        resultado=resultado
    )

    print(f"[signals] Mitigación registrada para {tipo.upper()} — pendiente de activación manual")
