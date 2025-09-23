from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Mitigacion
from .serializers import MitigacionSerializer

class MitigacionViewSet(viewsets.ModelViewSet):
    queryset = Mitigacion.objects.filter(activo=True)
    serializer_class = MitigacionSerializer

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=False, methods=['get'], url_path='inactivas')
    def listar_inactivas(self, request):
        queryset = Mitigacion.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='restaurar')
    def restaurar(self, request, pk=None):
        try:
            mitigacion = Mitigacion.objects.get(pk=pk, activo=False)
            mitigacion.activo = True
            mitigacion.save()
            return Response({"detail": "Mitigación restaurada exitosamente"}, status=status.HTTP_200_OK)
        except Mitigacion.DoesNotExist:
            return Response({"detail": "Mitigación no encontrada o ya está activa"}, status=status.HTTP_404_NOT_FOUND)