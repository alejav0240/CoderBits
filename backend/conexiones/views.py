from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .models import Conexion 
from .serializers import ConexionSerializer
from monitor_trafico import start_sniffer, stop_sniffer, is_monitoring


class ConexionViewSet(viewsets.ModelViewSet):
    queryset = Conexion.objects.all()
    serializer_class = ConexionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def activar_monitoreo(self, request):
        if is_monitoring():
            return Response(
                {"message": "El monitoreo ya está activo"}, 
                status=status.HTTP_200_OK
            )
        
        start_sniffer()
        return Response(
            {"message": "Monitoreo activado correctamente"}, 
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def desactivar_monitoreo(self, request):
        if not is_monitoring():
            return Response(
                {"message": "El monitoreo no está activo"}, 
                status=status.HTTP_200_OK
            )
        
        stop_sniffer()
        return Response(
            {"message": "Monitoreo desactivado correctamente"}, 
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def estado_monitoreo(self, request):
        estado = "activo" if is_monitoring() else "inactivo"
        return Response(
            {"estado": estado, "monitoreo_activo": is_monitoring()}, 
            status=status.HTTP_200_OK
        )