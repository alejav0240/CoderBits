from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Conexion 
from .serializers import ConexionSerializer
from .monitoreo import start_sniffer, monitor_activo_event
from rest_framework.permissions import IsAuthenticated


class ConexionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las conexiones capturadas en la red.
    Permite listar, crear y ver conexiones, además de activar/desactivar el monitoreo.
    """
    queryset = Conexion.objects.all()           # Todos los registros de conexiones
    serializer_class = ConexionSerializer       # Serializador para convertir a JSON
    permission_classes = [IsAuthenticated]     # Solo usuarios autenticados pueden usarlo

    @action(detail=False, methods=['post'])
    def activar_monitoreo(self, request):
        """
        Acción personalizada (POST /conexiones/activar_monitoreo/)
        Inicia el sniffer de red en un hilo independiente si no estaba activo.
        """
        start_sniffer()  
        return Response({"message": "Monitoreo activado"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def desactivar_monitoreo(self, request):
        """
        Acción personalizada (POST /conexiones/desactivar_monitoreo/)
        Pausa temporalmente el monitoreo sin detener el hilo del sniffer.
        """
        monitor_activo_event.clear()
        return Response({"message": "Monitoreo desactivado"}, status=status.HTTP_200_OK)
