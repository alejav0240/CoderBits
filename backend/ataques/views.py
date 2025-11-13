from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ataque
from .serializers import AtaqueSerializer
from rest_framework.permissions import IsAuthenticated


class AtaqueViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar los registros del modelo 'Ataque'.
    Permite operaciones CRUD (crear, listar, actualizar, eliminar)
    y define acciones personalizadas para ver ataques inactivos y restaurarlos.
    """
    
    # Consulta base: solo muestra ataques activos
    queryset = Ataque.objects.filter(activo=True)
    
    # Serializador que convierte los objetos Ataque a JSON y viceversa
    serializer_class = AtaqueSerializer
    
    # Solo usuarios autenticados pueden usar este endpoint
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        """
        En lugar de eliminar el registro definitivamente de la base de datos,
        se sobreescribe el método 'perform_destroy' para marcarlo como inactivo.
        """
        instance.delete()

    @action(detail=False, methods=['get'], url_path='inactivos')
    def listar_inactivos(self, request):
        """
        Endpoint personalizado (GET /ataques/inactivos/)
        Devuelve una lista de todos los ataques que están marcados como inactivos.
        """
        queryset = Ataque.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='restaurar')
    def restaurar(self, request, pk=None):
        """
        Endpoint personalizado (POST /ataques/{id}/restaurar/)
        Permite reactivar un ataque previamente inactivo.
        Si el ataque no existe o ya está activo, devuelve un error 404.
        """
        try:
            ataque = Ataque.objects.get(pk=pk, activo=False)
            ataque.activo = True
            ataque.save()
            return Response(
                {"detail": "Ataque restaurado exitosamente"},
                status=status.HTTP_200_OK
            )
        except Ataque.DoesNotExist:
            return Response(
                {"detail": "Ataque no encontrado o ya está activo"},
                status=status.HTTP_404_NOT_FOUND
            )
