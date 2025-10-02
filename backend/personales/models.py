from django.db import models
from roles.models import Rol

class Personal(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    numero = models.DecimalField(max_digits=20, decimal_places=0)
    correo = models.EmailField(unique=True)
    usuario = models.CharField(max_length=50, unique=True)
    contrasena = models.CharField(max_length=255)
    rol = models.ForeignKey(Rol, on_delete=models.RESTRICT, related_name="usuarios")
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
    
    def delete(self, *args, **kwargs):
        self.activo = False
        self.save()