from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Ataque
from mitigaciones.models import Mitigacion
import subprocess
import platform

@receiver(post_save, sender=Ataque)
def crear_mitigacion(sender, instance, created, **kwargs):
    if not created:
        return

    tipo = (instance.tipo or "desconocido").strip().lower()
    ip = instance.ip_origen or "desconocida"

    detalle = ""
    resultado = ""
    activo = True

    try:
        if tipo in ["neptune", "ddos"]:
            detalle = f"Bloqueo automático por ataque tipo {tipo.upper()}"
            activo = False

            if platform.system() == "Windows":
                try:
                    subprocess.run(
                        [
                            "netsh", "advfirewall", "firewall", "add", "rule",
                            f"name=Bloqueo_{ip}", "dir=in", "action=block",
                            f"remoteip={ip}"
                        ],
                        check=True,
                        capture_output=True,
                        text=True
                    )
                    resultado = "Bloqueada"
                except subprocess.CalledProcessError as e:
                    print("Error netsh:", e.stderr)
                    resultado = "No bloqueada"
            else:
                resultado = "No bloqueada (OS no soportado)"

        elif tipo == "satan":
            detalle = "Ataque tipo SATAN detectado — solo monitoreo."
            activo = True
            resultado = "No bloqueada"

        else:
            detalle = f"Ataque desconocido ({tipo.upper()})"
            resultado = "No bloqueada"

    except Exception as e:
        detalle = "Error en mitigación"
        resultado = "No bloqueada"

    Mitigacion.objects.create(
        ataque=instance,
        detalle=detalle,
        activo=activo,
        resultado=resultado
    )

    print(f"Mitigación creada: {tipo.upper()} -> {resultado}")
