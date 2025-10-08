from django.db import models
from .models import Rol
import re 
from rest_framework import serializers

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = "__all__"
        extra_kwargs = {
            'nombre_rol': {'min_length': 3, 'max_length': 20} 
        }

    def validate_nombre_rol(self, value):
        """Valida que el nombre del rol solo contenga letras, espacios o guiones."""
        
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$', value):
            raise serializers.ValidationError("El nombre del rol solo puede contener letras, espacios y guiones.")
        
        if len(value) < 3:
            raise serializers.ValidationError("El nombre del rol debe tener al menos 3 caracteres.")
            
        return value.upper() 