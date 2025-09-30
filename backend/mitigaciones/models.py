from django.db import models
from ataques.models import Ataque
from personales.models import Personal
import subprocess
import platform

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

    def bloquear_ip(self):
        if not self.ataque.ip_origen:
            self.resultado = "IP no definida"
            self.save()
            return

        ip = self.ataque.ip_origen
        try:
            if platform.system() == "Windows":
                subprocess.run(
                    ["netsh", "advfirewall", "firewall", "add", "rule",
                     f"name=Bloqueo_{ip}", "dir=in", "action=block", f"remoteip={ip}"],
                    check=True
                )
                self.resultado = f"IP {ip} bloqueada."
            else:
                self.resultado = "Bloqueo no implementado para este OS."
        except Exception as e:
            self.resultado = f"Error: {e}"
        self.save()

    def desbloquear_ip(self):
        if not self.ataque.ip_origen:
            self.resultado = "IP no definida"
            self.save()
            return

        ip = self.ataque.ip_origen
        try:
            if platform.system() == "Windows":
                subprocess.run(
                    ["netsh", "advfirewall", "firewall", "delete", "rule", f"name=Bloqueo_{ip}"],
                    check=True
                )
                self.resultado = f"IP {ip} desbloqueada."
            else:
                self.resultado = "Desbloqueo no implementado para este OS."
        except Exception as e:
            self.resultado = f"Error: {e}"
        self.save()
