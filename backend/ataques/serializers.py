from rest_framework import serializers
from .models import Ataque

class AtaqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ataque
        fields = "__all__"