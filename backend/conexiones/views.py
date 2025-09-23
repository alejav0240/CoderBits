from rest_framework import viewsets
from .models import Conexion
from .serializers import ConexionSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

class ConexionViewSet(viewsets.ModelViewSet):
    queryset = Conexion.objects.all()
    serializer_class = ConexionSerializer