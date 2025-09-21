from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import Ataque
from ..serializers import AtaqueSerializer

class AtaqueViewSet(viewsets.ModelViewSet):
    queryset = Ataque.objects.all()
    serializer_class = AtaqueSerializer

    # ✅ Eliminar lógico
    def destroy(self, request, *args, **kwargs):
        ataque = self.get_object()
        ataque.activo = False
        ataque.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # ✅ Listar activos
    @action(detail=False, methods=["get"], url_path="activos")
    def listar_activos(self, request):
        queryset = Ataque.objects.filter(activo=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # ✅ Listar inactivos
    @action(detail=False, methods=["get"], url_path="inactivos")
    def listar_inactivos(self, request):
        queryset = Ataque.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # ✅ Obtener un ataque activo
    @action(detail=True, methods=["get"], url_path="activo")
    def obtener_activo(self, request, pk=None):
        try:
            ataque = Ataque.objects.get(pk=pk, activo=True)
        except Ataque.DoesNotExist:
            return Response({"detail": "No encontrado o inactivo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(ataque)
        return Response(serializer.data)

    # ✅ Obtener un ataque inactivo
    @action(detail=True, methods=["get"], url_path="inactivo")
    def obtener_inactivo(self, request, pk=None):
        try:
            ataque = Ataque.objects.get(pk=pk, activo=False)
        except Ataque.DoesNotExist:
            return Response({"detail": "No encontrado o activo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(ataque)
        return Response(serializer.data)

    # 🔹 TOP N ataques por conteo_conexiones
    @action(detail=False, methods=["get"], url_path="top")
    def top_ataques(self, request):
        try:
            n = int(request.query_params.get("n", 20))  # default n=5 si no se manda
        except ValueError:
            return Response({"detail": "El parámetro n debe ser un número entero"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = Ataque.objects.filter(activo=True).order_by("-conteo_conexiones")[:n]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
