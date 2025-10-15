from rest_framework import serializers
from .models import Personal
import re 
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = [
            'id', 'nombre', 'apellido', 'numero', 'correo', 
            'usuario', 'contrasena', 'rol', 'activo', 'fecha_registro'
        ]
        extra_kwargs = {
            'contrasena': {'write_only': True, 'min_length': 8, 'max_length': 20}
        }

    # --- Validaciones de campos ---
    def validate_nombre(self, value):
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise serializers.ValidationError("El nombre solo debe contener letras y espacios.")
        if len(value) < 2:
            raise serializers.ValidationError("El nombre es demasiado corto. Mínimo 2 caracteres.")
        # Validación de existencia conjunta con apellido si ya hay un registro
        apellido = self.initial_data.get('apellido')
        if apellido and Personal.objects.filter(nombre__iexact=value, apellido__iexact=apellido).exists():
            raise serializers.ValidationError("Ya existe un registro con este nombre y apellido.")
        return value.capitalize() 

    def validate_apellido(self, value):
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise serializers.ValidationError("El apellido solo debe contener letras y espacios.")
        if len(value) < 2:
            raise serializers.ValidationError("El apellido es demasiado corto. Mínimo 2 caracteres.")
        # Validación de existencia conjunta con nombre
        nombre = self.initial_data.get('nombre')
        if nombre and Personal.objects.filter(nombre__iexact=nombre, apellido__iexact=value).exists():
            raise serializers.ValidationError("Ya existe un registro con este nombre y apellido.")
        return value.capitalize()

    def validate_numero(self, value):
        try:
            numero_str = str(int(value))
        except ValueError:
            raise serializers.ValidationError("El número de contacto solo debe contener dígitos (0-9).")
        if value <= 0:
            raise serializers.ValidationError("El número debe ser un valor positivo.")
        if len(numero_str) != 8:
            raise serializers.ValidationError("El número de contacto debe tener exactamente 8 dígitos.")
        return value

    def validate_contrasena(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("La contraseña debe incluir al menos una letra mayúscula.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("La contraseña debe incluir al menos un número.")
        return value

    def validate_correo(self, value):
        if Personal.objects.filter(correo=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado. Por favor usa otro.")
        return value

    def validate_usuario(self, value):
        if Personal.objects.filter(usuario=value).exists():
            raise serializers.ValidationError("Este usuario ya está registrado. Por favor usa otro.")
        return value

    # --- Create y Update ---
    def create(self, validated_data):
        validated_data['contrasena'] = make_password(validated_data['contrasena'])
        try:
            return super().create(validated_data)
        except IntegrityError as e:
            # Captura errores por unique en base de datos
            if 'correo' in str(e):
                raise serializers.ValidationError({"correo": "Este correo ya está registrado. Por favor usa otro."})
            if 'usuario' in str(e):
                raise serializers.ValidationError({"usuario": "Este usuario ya está registrado. Por favor usa otro."})
            raise e

    def update(self, instance, validated_data):
        if 'contrasena' in validated_data:
            instance.contrasena = make_password(validated_data.pop('contrasena'))
        return super().update(instance, validated_data)
