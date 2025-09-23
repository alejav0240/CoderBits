from rest_framework import viewsets
from .models import Rol
from .serializers import RolSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer