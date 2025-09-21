from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Personal
from ..serializers import PersonalSerializer

class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer

    def destroy(self, request, *args, **kwargs):
        personal = self.get_object()
        personal.activo = False
        personal.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], url_path="activos")
    def listar_activos(self, request):
        queryset = Personal.objects.filter(activo=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="inactivos")
    def listar_inactivos(self, request):
        queryset = Personal.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="activo")
    def obtener_activo(self, request, pk=None):
        try:
            personal = Personal.objects.get(pk=pk, activo=True)
        except Personal.DoesNotExist:
            return Response({"detail": "No encontrado o inactivo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(personal)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="inactivo")
    def obtener_inactivo(self, request, pk=None):
        try:
            personal = Personal.objects.get(pk=pk, activo=False)
        except Personal.DoesNotExist:
            return Response({"detail": "No encontrado o activo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(personal)
        return Response(serializer.data)
