from rest_framework import viewsets
from ..models import Conexion
from ..serializers import ConexionSerializer

class ConexionViewSet(viewsets.ModelViewSet):
    queryset = Conexion.objects.all()
    serializer_class = ConexionSerializer
