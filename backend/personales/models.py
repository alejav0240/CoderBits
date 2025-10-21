from django.db import models
from roles.models import Rol
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password 

class Personal(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    numero = models.DecimalField(max_digits=20, decimal_places=0)
    correo = models.EmailField()
    usuario = models.CharField(max_length=50, unique=True)
    contrasena = models.CharField(max_length=255)
    rol = models.ForeignKey(Rol, on_delete=models.RESTRICT, related_name="usuarios")
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    # Atributos para pasar los checks de Django
    USERNAME_FIELD = 'usuario'
    REQUIRED_FIELDS = ['nombre', 'apellido', 'correo', 'numero'] 
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.id and self.contrasena:
            self.contrasena = make_password(self.contrasena)
        super().save(*args, **kwargs)

    # Propiedades OBLIGATORIAS para un modelo de usuario personalizado:
    
    @property
    def is_active(self):
        return self.activo
    
    @property
    def is_authenticated(self):
        # Un usuario basado en un objeto Personal siempre está autenticado (cuando se obtiene)
        return True 
    
    @property
    def is_anonymous(self):
        # Un usuario basado en un objeto Personal nunca es anónimo
        return False # <--- ESTO RESUELVE EL ERROR

    def has_perm(self, perm, obj=None):
        return self.is_superuser
    
    def has_module_perms(self, app_label):
        return self.is_superuser
    
    # El resto de tus métodos...
    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    def delete(self, *args, **kwargs):
        self.activo = False
        self.save()
        return Response({"message": "El usuario ha sido eliminado correctamente."}, status=status.HTTP_200_OK)