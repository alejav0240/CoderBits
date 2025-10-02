from django.db import models
from ataques.models import Ataque
from personales.models import Personal
from django.shortcuts import get_object_or_404
from mitigaciones.models import Mitigacion
import subprocess
from django.http import JsonResponse

class Mitigacion(models.Model):
    ataque = models.ForeignKey(Ataque, on_delete=models.CASCADE, related_name="mitigaciones")
    detalle = models.TextField(null=True, blank=True)
    ejecutado_por = models.ForeignKey(Personal, on_delete=models.SET_NULL, null=True, blank=True)
    activo = models.BooleanField(default=True)
    fecha_mitigacion = models.DateTimeField(auto_now_add=True)
    resultado = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Mitigación para Ataque {self.ataque.id}"

    def delete(self, *args, **kwargs):
        self.activo = False
        self.save()

def activar_mitigacion(request, mitigacion_id):
    mitig = get_object_or_404(Mitigacion, id=mitigacion_id)

    if mitig.activo:
        return JsonResponse({"status": "ya activada"})

    # Ejecutar bloqueo
    ip = mitig.ataque.ip_origen
    try:
        subprocess.run(
            ["netsh", "advfirewall", "firewall", "add", "rule",
             "name=", f"Bloqueo_{ip}",
             "dir=in", "action=block", f"remoteip={ip}"],
            check=True
        )
        mitig.activo = True
        mitig.resultado = f"IP {ip} bloqueada manualmente"
        mitig.save()
        return JsonResponse({"status": "activada", "resultado": mitig.resultado})
    except Exception as e:
        mitig.resultado = f"Error al bloquear IP {ip}: {e}"
        mitig.save()
        return JsonResponse({"status": "error", "resultado": mitig.resultado})