from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Mitigacion
from .serializers import MitigacionSerializer

class MitigacionViewSet(viewsets.ModelViewSet):
    queryset = Mitigacion.objects.all()
    serializer_class = MitigacionSerializer

    def perform_destroy(self, instance):
        """Elimina lógicamente (marca como inactiva)"""
        instance.delete()

    # Listar solo inactivas
    @action(detail=False, methods=['get'], url_path='inactivas')
    def listar_inactivas(self, request):
        queryset = Mitigacion.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Restaurar una mitigación
    @action(detail=True, methods=['post'], url_path='restaurar')
    def restaurar(self, request, pk=None):
        try:
            mitigacion = Mitigacion.objects.get(pk=pk, activo=False)
            mitigacion.activo = True
            mitigacion.save()
            return Response({"detail": "Mitigación restaurada exitosamente"}, status=status.HTTP_200_OK)
        except Mitigacion.DoesNotExist:
            return Response({"detail": "Mitigación no encontrada o ya está activa"}, status=status.HTTP_404_NOT_FOUND)

    # Bloquear IP desde la API
    @action(detail=True, methods=['post'], url_path='bloquear')
    def bloquear(self, request, pk=None):
        try:
            mitigacion = self.get_object()
            mitigacion.bloquear_ip()
            return Response({"detail": mitigacion.resultado}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Desbloquear IP desde la API
    @action(detail=True, methods=['post'], url_path='desbloquear')
    def desbloquear(self, request, pk=None):
        try:
            mitigacion = self.get_object()
            mitigacion.desbloquear_ip()
            return Response({"detail": mitigacion.resultado}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
