from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Conexion 
from .serializers import ConexionSerializer
from .monitoreo import start_sniffer, monitor_activo_event

class ConexionViewSet(viewsets.ModelViewSet):
    queryset = Conexion.objects.all()
    serializer_class = ConexionSerializer

    @action(detail=False, methods=['post'])
    def activar_monitoreo(self, request):
        start_sniffer()  
        return Response({"message": "Monitoreo activado"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def desactivar_monitoreo(self, request):
        monitor_activo_event.clear()
        return Response({"message": "Monitoreo desactivado"}, status=status.HTTP_200_OK)