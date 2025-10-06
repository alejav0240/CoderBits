from django.db import models
from ataques.models import Ataque
from personales.models import Personal
from django.shortcuts import get_object_or_404
import subprocess
from django.http import JsonResponse

class Mitigacion(models.Model):
    ataque = models.ForeignKey(Ataque, on_delete=models.CASCADE, related_name="mitigaciones")
    detalle = models.TextField(null=True, blank=True)
    ip = models.TextField(null=True, blank=True)
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

    ip = mitig.ataque.ip_origen
    
    import re
    if not re.match(r'^(\d{1,3}\.){3}\d{1,3}$', ip):
        mitig.resultado = f"IP inválida: {ip}"
        mitig.save()
        return JsonResponse({"status": "error", "resultado": mitig.resultado})
    
    try:
        result = subprocess.run(
            ["netsh", "advfirewall", "firewall", "add", "rule",
             f"name=Bloqueo_{ip}",
             "dir=in", 
             "action=block", 
             f"remoteip={ip}"],
            check=True,
            capture_output=True,
            text=True
        )
        
        mitig.activo = True
        mitig.resultado = f"IP {ip} bloqueada correctamente"
        mitig.save()
        return JsonResponse({"status": "activada", "resultado": mitig.resultado})
        
    except subprocess.CalledProcessError as e:
        error_msg = f"Error al bloquear IP {ip}: {e.stderr}"
        mitig.resultado = error_msg
        mitig.save()
        return JsonResponse({"status": "error", "resultado": error_msg})
        
    except Exception as e:
        mitig.resultado = f"Error inesperado: {str(e)}"
        mitig.save()
        return JsonResponse({"status": "error", "resultado": mitig.resultado})