from django.db import models

class Conexion(models.Model):
    hora = models.DateTimeField()
    ip_src = models.CharField(max_length=45)
    ip_dst = models.CharField(max_length=45)
    port_dst = models.IntegerField()
    etiqueta = models.CharField(max_length=50)
    confianza = models.IntegerField(null=True, blank=True)