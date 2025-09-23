from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Personal
from .serializers import PersonalSerializer

class PersonalViewSet(viewsets.ModelViewSet):
    # La consulta principal debe incluir todos los registros para que la API
    # pueda manejar las acciones de listar inactivos, obtener inactivos, etc.
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer

    # Tus @action personalizadas permanecen igual
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

    @action(detail=True, methods=["post"], url_path="restaurar")
    def restaurar(self, request, pk=None):
        try:
            personal = Personal.objects.get(pk=pk, activo=False)
            personal.activo = True
            personal.save()
            return Response({"detail": "Usuario restaurado exitosamente"}, status=status.HTTP_200_OK)
        except Personal.DoesNotExist:
            return Response({"detail": "Usuario no encontrado o ya está activo"}, status=status.HTTP_404_NOT_FOUND)


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