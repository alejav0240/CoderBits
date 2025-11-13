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
import threading
import time

class MitigacionViewSet(viewsets.ModelViewSet):
    queryset = Mitigacion.objects.all().order_by('-fecha_mitigacion')
    serializer_class = MitigacionSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['activo', 'resultado']
    search_fields = ['ip']
    
    # Variable de clase para controlar el hilo de activación automática
    _auto_activacion_activa = False
    _auto_activacion_thread = None
    _lock = threading.Lock()
        
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

    def _activar_mitigacion_automatica(self, mitigacion_id):
        """
        Activa una mitigación específica (lógica interna).
        """
        try:
            mitigacion = Mitigacion.objects.get(pk=mitigacion_id, activo=False)
            ip = mitigacion.ip
            
            if not ip or ip == "desconocida":
                return False
            
            cmd = [
                "netsh", "advfirewall", "firewall", "add", "rule",
                f"name=Bloqueo_{ip}",
                "dir=in", 
                "action=block", 
                f"remoteip={ip}"
            ]
            
            subprocess.run(cmd, capture_output=True, text=True, timeout=5, check=True)
            
            mitigacion.activo = True
            mitigacion.resultado = f"IP {ip} bloqueada automáticamente"
            mitigacion.fecha_mitigacion = timezone.now()
            mitigacion.save()
            
            return True
        except Exception as e:
            print(f"Error en activación automática: {str(e)}")
            return False

    def _proceso_activacion_automatica(self):
        """
        Proceso que se ejecuta continuamente activando mitigaciones pendientes.
        """
        print("Iniciando proceso de activación automática de mitigaciones...")
        
        while MitigacionViewSet._auto_activacion_activa:
            try:
                # Buscar mitigaciones pendientes (activo=False)
                mitigaciones_pendientes = Mitigacion.objects.filter(activo=False)
                
                for mitigacion in mitigaciones_pendientes:
                    if not MitigacionViewSet._auto_activacion_activa:
                        break
                    
                    self._activar_mitigacion_automatica(mitigacion.id)
                    print(f"Mitigación {mitigacion.id} activada automáticamente")
                
                # Esperar 10 segundos antes de la siguiente verificación
                time.sleep(10)
                
            except Exception as e:
                print(f"Error en el proceso automático: {str(e)}")
                time.sleep(10)
        
        print("Proceso de activación automática detenido.")

    @action(detail=False, methods=['post'], url_path='iniciar_automatico')
    def iniciar_automatico(self, request):
        """
        Inicia el proceso de activación automática continua de mitigaciones.
        """
        with MitigacionViewSet._lock:
            if MitigacionViewSet._auto_activacion_activa:
                return Response({
                    'mensaje': 'El proceso de activación automática ya está en ejecución',
                    'activo': True
                }, status=status.HTTP_200_OK)
            
            MitigacionViewSet._auto_activacion_activa = True
            
            # Crear y arrancar el hilo
            MitigacionViewSet._auto_activacion_thread = threading.Thread(
                target=self._proceso_activacion_automatica,
                daemon=True
            )
            MitigacionViewSet._auto_activacion_thread.start()
            
            return Response({
                'mensaje': 'Proceso de activación automática iniciado correctamente',
                'activo': True
            }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='detener_automatico')
    def detener_automatico(self, request):
        """
        Detiene el proceso de activación automática continua de mitigaciones.
        """
        with MitigacionViewSet._lock:
            if not MitigacionViewSet._auto_activacion_activa:
                return Response({
                    'mensaje': 'El proceso de activación automática no está en ejecución',
                    'activo': False
                }, status=status.HTTP_200_OK)
            
            MitigacionViewSet._auto_activacion_activa = False
            
            return Response({
                'mensaje': 'Proceso de activación automática detenido correctamente',
                'activo': False
            }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='estado_automatico')
    def estado_automatico(self, request):
        """
        Consulta el estado del proceso de activación automática.
        """
        return Response({
            'activo': MitigacionViewSet._auto_activacion_activa,
            'mensaje': 'Proceso en ejecución' if MitigacionViewSet._auto_activacion_activa else 'Proceso detenido'
        }, status=status.HTTP_200_OK)