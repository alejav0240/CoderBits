from rest_framework import serializers
from .models import Mitigacion
import subprocess

class MitigacionSerializer(serializers.ModelSerializer):
    nombre_ataque = serializers.CharField(source='ataque.tipo', read_only=True)
    ejecutado_por_nombre = serializers.CharField(source='ejecutado_por.nombre', read_only=True)
    class Meta:
        model = Mitigacion
        fields = [
            'id',
            'ataque',
            'nombre_ataque',
            'ip',
            'detalle',
            'ejecutado_por',
            'ejecutado_por_nombre',
            'activo',
            'fecha_mitigacion',
            'resultado'
        ]

    def bloquear_ip(self):
        ip = self.ataque.ip_origen
        if not ip:
            self.resultado = "Sin IP para bloquear."
            self.save()
            return

        try:
            subprocess.run(
                ["netsh", "advfirewall", "firewall", "add", "rule",
                 f"name=Bloqueo_{ip}", "dir=in", "action=block", f"remoteip={ip}"],
                check=True, capture_output=True, text=True
            )
            self.resultado = f"IP {ip} bloqueada manualmente."
            self.activo = False
        except Exception as e:
            self.resultado = f"Error al bloquear IP: {e}"
        self.save()

    def desbloquear_ip(self):
        ip = self.ataque.ip_origen
        if not ip:
            self.resultado = "Sin IP para desbloquear."
            self.save()
            return

        try:
            subprocess.run(
                ["netsh", "advfirewall", "firewall", "delete", "rule", f"name=Bloqueo_{ip}"],
                check=False, capture_output=True, text=True
            )
            self.resultado = f"IP {ip} desbloqueada manualmente."
            self.activo = True
        except Exception as e:
            self.resultado = f"Error al desbloquear IP: {e}"
        self.save()

