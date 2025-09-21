from rest_framework import serializers
from .models import Rol, Personal, Conexion, Ataque, Mitigacion

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = "__all__"

class PersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = "__all__"

class ConexionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conexion
        fields = "__all__"

class AtaqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ataque
        fields = "__all__"

class MitigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mitigacion
        fields = "__all__"
