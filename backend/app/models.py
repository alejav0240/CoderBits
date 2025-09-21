from django.db import models

class Rol(models.Model):
    nombre_rol = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre_rol


class Personal(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    numero = models.DecimalField(max_digits=20, decimal_places=0)  # para números grandes
    correo = models.EmailField(unique=True)
    usuario = models.CharField(max_length=50, unique=True)
    contrasena = models.CharField(max_length=255)
    rol = models.ForeignKey(Rol, on_delete=models.RESTRICT, related_name="usuarios")
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Conexion(models.Model):
    hora = models.DateTimeField()
    ip_src = models.CharField(max_length=45)
    ip_dst = models.CharField(max_length=45)
    port_dst = models.IntegerField()
    etiqueta = models.CharField(max_length=50)
    confianza = models.IntegerField(null=True, blank=True)


class Ataque(models.Model):
    tipo = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    ip_origen = models.CharField(max_length=45, null=True, blank=True)
    ip_destino = models.CharField(max_length=45, null=True, blank=True)
    puerto = models.IntegerField(null=True, blank=True)
    fecha_detectado = models.DateTimeField(auto_now_add=True)
    conteo_conexiones = models.IntegerField(null=True, blank=True)
    activo = models.BooleanField(default=True)


class Mitigacion(models.Model):
    ataque = models.ForeignKey(Ataque, on_delete=models.CASCADE, related_name="mitigaciones")
    detalle = models.TextField(null=True, blank=True)
    ejecutado_por = models.ForeignKey(Personal, on_delete=models.SET_NULL, null=True, blank=True)
    activo = models.BooleanField(default=True)
    fecha_mitigacion = models.DateTimeField(auto_now_add=True)
    resultado = models.CharField(max_length=100, null=True, blank=True)
