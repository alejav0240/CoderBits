from rest_framework import serializers
from .models import Mitigacion

class MitigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mitigacion
        fields = ['id', 'ataque', 'ip', 'detalle', 'ejecutado_por', 'activo', 'fecha_mitigacion', 'resultado']

