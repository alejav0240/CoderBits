from rest_framework import serializers
from .models import Personal
import re 
from django.contrib.auth.hashers import make_password

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = [
            'id', 'nombre', 'apellido', 'numero', 'correo', 
            'usuario', 'contrasena', 'rol', 'activo', 'fecha_registro'
        ]
        extra_kwargs = {
            'contrasena': {'write_only': True, 'min_length': 8, 'max_length':20}
        }

    # --- 1. VALIDACIONES A NIVEL DE CAMPO ---
    
    def validate_nombre(self, value):
        """Valida formato y longitud del nombre."""
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise serializers.ValidationError("El nombre solo debe contener letras y espacios.")
        if len(value) < 2:
            raise serializers.ValidationError("El nombre es demasiado corto. Mínimo 2 caracteres.")
        return value.capitalize() 

    def validate_apellido(self, value):
        """Valida formato y longitud del apellido."""
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise serializers.ValidationError("El apellido solo debe contener letras y espacios.")
        if len(value) < 2:
            raise serializers.ValidationError("El apellido es demasiado corto. Mínimo 2 caracteres.")
        return value.capitalize()

    def validate_numero(self, value):
        try:
            numero_str = str(int(value))
        except ValueError:
            raise serializers.ValidationError("El número de contacto solo debe contener dígitos (0-9).")

        if value <= 0:
            raise serializers.ValidationError("El número debe ser un valor positivo.")
            
        if not (7 <= len(numero_str) <= 15):
             raise serializers.ValidationError("El número de contacto debe tener entre 7 y 15 dígitos.")
             
        return value

    def validate_contrasena(self, value):
        """Valida la complejidad de la contraseña."""
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("La contraseña debe incluir al menos una letra mayúscula.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("La contraseña debe incluir al menos un número.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
             raise serializers.ValidationError("La contraseña debe incluir al menos un carácter especial.")

        return value
        

    def create(self, validated_data):
        validated_data['contrasena'] = make_password(validated_data['contrasena'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'contrasena' in validated_data:
            instance.contrasena = make_password(validated_data.pop('contrasena'))
        
        return super().update(instance, validated_data)