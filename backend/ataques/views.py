from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ataque
from .serializers import AtaqueSerializer

class AtaqueViewSet(viewsets.ModelViewSet):
    queryset = Ataque.objects.filter(activo=True)
    serializer_class = AtaqueSerializer

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=False, methods=['get'], url_path='inactivos')
    def listar_inactivos(self, request):
        queryset = Ataque.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='restaurar')
    def restaurar(self, request, pk=None):
        try:
            ataque = Ataque.objects.get(pk=pk, activo=False)
            ataque.activo = True
            ataque.save()
            return Response({"detail": "Ataque restaurado exitosamente"}, status=status.HTTP_200_OK)
        except Ataque.DoesNotExist:
            return Response({"detail": "Ataque no encontrado o ya está activo"}, status=status.HTTP_404_NOT_FOUND)