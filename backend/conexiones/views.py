from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Conexion 
from .serializers import ConexionSerializer
from django.http import JsonResponse
from .monitoreo import start_sniffer, monitor_activo

class ConexionViewSet(viewsets.ModelViewSet):
    queryset = Conexion.objects.all()
    serializer_class = ConexionSerializer

def activar_monitoreo(request):
    global monitor_activo
    monitor_activo = True
    start_sniffer()
    return JsonResponse({"message": "Monitoreo activado"})

def desactivar_monitoreo(request):
    global monitor_activo
    monitor_activo = False
    return JsonResponse({"message": "Monitoreo desactivado"})