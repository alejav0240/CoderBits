from rest_framework import serializers
from .models import Mitigacion
import subprocess


class MitigacionSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Mitigacion.
    Permite convertir los datos de Mitigacion a JSON y también
    ejecutar métodos para bloquear/desbloquear IPs manualmente.
    """
    nombre_ataque = serializers.CharField(source='ataque.tipo', read_only=True)          # Nombre del tipo de ataque
    ejecutado_por_nombre = serializers.CharField(source='ejecutado_por.nombre', read_only=True)  # Nombre del personal que ejecutó la mitigación

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
        """
        Bloquea la IP de la mitigación usando NETSH en Windows.
        Actualiza el estado y resultado de la mitigación en la base de datos.
        """
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
        """
        Desbloquea la IP de la mitigación usando NETSH en Windows.
        Actualiza el estado y resultado de la mitigación en la base de datos.
        """
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
