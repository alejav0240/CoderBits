from django.db import models

class Conexion(models.Model):
    hora = models.DateTimeField()
    ip_src = models.CharField(max_length=45)
    ip_dst = models.CharField(max_length=45)
    port_dst = models.IntegerField(null=True, blank=True)
    etiqueta = models.CharField(max_length=50)
    protocolo = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.ip_src} -> {self.ip_dst} | {self.protocolo}"
