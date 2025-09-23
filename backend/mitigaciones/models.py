from django.db import models
from ataques.models import Ataque
from personales.models import Personal

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