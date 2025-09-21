from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Rol
from ..serializers import RolSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

    # Eliminación lógica opcional si agregas campo 'activo' en Rol
    # def destroy(self, request, *args, **kwargs):
    #     rol = self.get_object()
    #     rol.activo = False
    #     rol.save()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
