from rest_framework import serializers
from .models import Mitigacion

class MitigacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mitigacion
        fields = "__all__"

