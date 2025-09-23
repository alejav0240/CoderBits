from django.db import models

class Ataque(models.Model):
    tipo = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    ip_origen = models.CharField(max_length=45, null=True, blank=True)
    ip_destino = models.CharField(max_length=45, null=True, blank=True)
    puerto = models.IntegerField(null=True, blank=True)
    fecha_detectado = models.DateTimeField(auto_now_add=True)
    conteo_conexiones = models.IntegerField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.tipo

    def delete(self, *args, **kwargs):
        self.activo = False
        self.save()