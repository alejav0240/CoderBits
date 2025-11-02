from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from mitigaciones.pagination import CustomPagination
from .models import Mitigacion
from .serializers import MitigacionSerializer
import subprocess
from django.utils import timezone
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

class MitigacionViewSet(viewsets.ModelViewSet):
    queryset = Mitigacion.objects.all().order_by('-fecha_mitigacion')
    serializer_class = MitigacionSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['activo', 'resultado']
    search_fields = ['ip']
        
    @action(detail=True, methods=['post'], url_path='activar')
    def activar(self, request, pk=None):
        """
        Activa una mitigación pendiente (activo=False) bloqueando la IP con NETSH (Windows).
        """
        try:
            mitigacion = self.get_queryset().get(pk=pk, activo=False)
            
            ip = mitigacion.ip
            if not ip or ip == "desconocida":
                return Response({'error': 'IP no válida para bloquear'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                cmd = [
                    "netsh", "advfirewall", "firewall", "add", "rule",
                    f"name=Bloqueo_{ip}",
                    "dir=in", 
                    "action=block", 
                    f"remoteip={ip}"
                ]

                result = subprocess.run(
                    cmd, 
                    capture_output=True, 
                    text=True, 
                    timeout=5,
                    check=True
                )
                
                mitigacion.activo = True
                mitigacion.resultado = f"IP {ip} bloqueada exitosamente en Windows Firewall (NETSH)"
                mitigacion.fecha_mitigacion = timezone.now() 
                mitigacion.save()
                
                serializer = self.get_serializer(mitigacion)
                return Response(serializer.data, status=status.HTTP_200_OK)
                
            except subprocess.CalledProcessError as e:
                error_msg = f'Error al ejecutar NETSH: {e.stderr}'
                mitigacion.resultado = error_msg
                mitigacion.save()
                return Response({'error': error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({'error': f'Error al bloquear IP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Mitigacion.DoesNotExist:
            return Response({'error': 'Mitigación no encontrada o ya está activa'}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=True, methods=['post'], url_path='desactivar')
    def desactivar(self, request, pk=None):
        try:
            mitigacion = self.get_queryset().get(pk=pk, activo=True)
            
            ip = mitigacion.ip
            if not ip or ip == "desconocida":
                return Response({'error': 'IP no válida para desbloquear'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                cmd = [
                    "netsh", "advfirewall", "firewall", "delete", "rule",
                    f"name=Bloqueo_{ip}" 
                ]
                
                result = subprocess.run(
                    cmd, 
                    capture_output=True, 
                    text=True, 
                    timeout=5,
                    check=True
                )
                
                mitigacion.activo = False
                mitigacion.resultado = f"IP {ip} desbloqueada"
                mitigacion.save()
                
                serializer = self.get_serializer(mitigacion)
                return Response(serializer.data, status=status.HTTP_200_OK)
                
            except subprocess.CalledProcessError as e:
                error_msg = f'Error al ejecutar NETSH - Delete: {e.stderr}'
                mitigacion.resultado = error_msg
                mitigacion.save()
                return Response({'error': error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({'error': f'Error al desbloquear IP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Mitigacion.DoesNotExist:
            return Response({'error': 'Mitigación no encontrada o ya está inactiva'}, status=status.HTTP_404_NOT_FOUND)