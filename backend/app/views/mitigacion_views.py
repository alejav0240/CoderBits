from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Mitigacion
from ..serializers import MitigacionSerializer

class MitigacionViewSet(viewsets.ModelViewSet):
    queryset = Mitigacion.objects.all()
    serializer_class = MitigacionSerializer

    def destroy(self, request, *args, **kwargs):
        mitigacion = self.get_object()
        mitigacion.activo = False
        mitigacion.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], url_path="activos")
    def listar_activos(self, request):
        queryset = Mitigacion.objects.filter(activo=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="inactivos")
    def listar_inactivos(self, request):
        queryset = Mitigacion.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="activo")
    def obtener_activo(self, request, pk=None):
        try:
            mitigacion = Mitigacion.objects.get(pk=pk, activo=True)
        except Mitigacion.DoesNotExist:
            return Response({"detail": "No encontrado o inactivo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(mitigacion)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="inactivo")
    def obtener_inactivo(self, request, pk=None):
        try:
            mitigacion = Mitigacion.objects.get(pk=pk, activo=False)
        except Mitigacion.DoesNotExist:
            return Response({"detail": "No encontrado o activo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(mitigacion)
        return Response(serializer.data)
