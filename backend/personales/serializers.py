from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from .models import Personal
import re


class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = [
            'id', 'nombre', 'apellido', 'numero', 'correo',
            'usuario', 'contrasena', 'rol', 'activo', 'fecha_registro'
        ]
        extra_kwargs = {
            'contrasena': {'write_only': True, 'min_length': 8, 'max_length': 20},
            'correo': {'validators': []},    # 🔥 Desactiva validación única automática
            'usuario': {'validators': []},   # 🔥 Desactiva validación única automática
        }

    # -------------------------
    # VALIDACIONES DE CAMPOS
    # -------------------------
    def validate_nombre(self, value):
        """Valida formato, longitud y duplicados (nombre + apellido)"""
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise serializers.ValidationError("El nombre solo debe contener letras y espacios.")
        if len(value) < 2:
            raise serializers.ValidationError("El nombre es demasiado corto. Mínimo 2 caracteres.")

        return value.capitalize()

    def validate_apellido(self, value):
        """Valida formato, longitud y duplicados (apellido + nombre)"""
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise serializers.ValidationError("El apellido solo debe contener letras y espacios.")
        if len(value) < 2:
            raise serializers.ValidationError("El apellido es demasiado corto. Mínimo 2 caracteres.")

        return value.capitalize()

    def validate_numero(self, value):
        """Valida que el número sea positivo y tenga 8 dígitos"""
        try:
            numero_str = str(int(value))
        except ValueError:
            raise serializers.ValidationError("El número de contacto solo debe contener dígitos (0-9).")
        if int(value) <= 0:
            raise serializers.ValidationError("El número debe ser un valor positivo.")
        if len(numero_str) != 8:
            raise serializers.ValidationError("El número de contacto debe tener exactamente 8 dígitos.")
        return value

    def validate_contrasena(self, value):
        """Valida la complejidad mínima de la contraseña"""
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Debe incluir al menos una letra mayúscula.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Debe incluir al menos un número.")
        return value

    def validate_correo(self, value):
        """Evita duplicados de correo"""
        qs = Personal.objects.filter(correo=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("Este correo ya está registrado. Usa otro.",qs)
        return value

    def validate_usuario(self, value):
        """Evita duplicados de usuario"""
        qs = Personal.objects.filter(usuario=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
            print("Excluyendo instancia:", qs.exclude(id=self.instance.id))
        if qs.exists():
            raise serializers.ValidationError("Este usuario ya está registrado. Usa otro.",qs)
        return value

    # -------------------------
    # CREACIÓN Y ACTUALIZACIÓN
    # -------------------------
    def create(self, validated_data):
        """Crea el usuario encriptando la contraseña"""
        validated_data['contrasena'] = make_password(validated_data['contrasena'])
        try:
            return super().create(validated_data)
        except IntegrityError as e:
            error_message = str(e).lower()
            if 'unique_correo' in error_message or 'correo' in error_message:
                raise serializers.ValidationError({"correo": ["Este correo ya está registrado. Usa otro."]})
            if 'unique_usuario' in error_message or 'usuario' in error_message:
                raise serializers.ValidationError({"usuario": ["Este usuario ya está registrado. Usa otro."]})
            raise serializers.ValidationError({"detail": "Error al crear el usuario. Intenta nuevamente."})


    def update(self, instance, validated_data):
        """Actualiza el usuario sin permitir cambiar 'correo' ni 'usuario', y maneja la contraseña correctamente."""
        # Eliminar campos que no deben actualizarse
        validated_data.pop('correo', None)
        validated_data.pop('usuario', None)

        # Actualizar contraseña si fue enviada
        contrasena = validated_data.pop('contrasena', None)
        if contrasena:
            instance.contrasena = make_password(contrasena)

        # Llamar al update normal para los demás campos
        return super().update(instance, validated_data)

