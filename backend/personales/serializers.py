from rest_framework import serializers
from .models import Personal
from django.contrib.auth.hashers import make_password

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = ['id', 'nombre', 'apellido', 'numero', 'correo', 'usuario', 'contrasena', 'rol', 'activo', 'fecha_registro']
        read_only_fields = ['fecha_registro']
        extra_kwargs = {
            'contrasena': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['contrasena'] = make_password(validated_data['contrasena'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'contrasena' in validated_data:
            validated_data['contrasena'] = make_password(validated_data['contrasena'])
        return super().update(instance, validated_data)