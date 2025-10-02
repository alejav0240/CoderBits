from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Mitigacion
from .serializers import MitigacionSerializer
import subprocess
from django.utils import timezone
from django.db.models import Q # Importar Q para un filtro más robusto

class MitigacionViewSet(viewsets.ModelViewSet):
    # CLAVE 1: Usar el queryset completo para que el router pueda mapear todas las acciones (activar/desactivar).
    # Si esta línea da errores de DB, asegúrate de que el modelo está configurado.
    queryset = Mitigacion.objects.all() 
    serializer_class = MitigacionSerializer
    
    def get_queryset(self):
        """
        Sobreescribe get_queryset para filtrar solo las mitigaciones activas en la acción 'list' 
        (ej: GET /api/mitigaciones/).
        Para las acciones detail, activate, y deactivate, retorna el queryset completo.
        """
        # Si la acción es la principal de listado (GET /mitigaciones/), filtra por activo=True
        if self.action == 'list':
            return self.queryset.filter(activo=True)
        
        # Para todas las demás acciones (detail, activar, desactivar), retorna todo.
        return self.queryset

    def perform_destroy(self, instance):
        # Utiliza la eliminación lógica definida en tu modelo
        instance.delete()

    @action(detail=False, methods=['get'], url_path='inactivas')
    def listar_inactivas(self, request):
        # Esta acción ya está bien, usa un filtro explícito.
        queryset = Mitigacion.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='restaurar')
    def restaurar(self, request, pk=None):
        # ... (Este código está bien, opera sobre activo=False) ...
        try:
            mitigacion = Mitigacion.objects.get(pk=pk, activo=False)
            mitigacion.activo = True
            mitigacion.save()
            return Response({"detail": "Mitigación restaurada exitosamente"}, status=status.HTTP_200_OK)
        except Mitigacion.DoesNotExist:
            return Response({"detail": "Mitigación no encontrada o ya está activa"}, status=status.HTTP_404_NOT_FOUND)
        
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
            
            # Bloquear IP con NETSH (Comando de Windows Firewall)
            try:
                # Comando para agregar la regla de bloqueo de tráfico entrante desde la IP de origen
                cmd = [
                    "netsh", "advfirewall", "firewall", "add", "rule",
                    f"name=Bloqueo_{ip}",
                    "dir=in", 
                    "action=block", 
                    f"remoteip={ip}"
                ]

                # Nota: Este comando a menudo requiere permisos de administrador. 
                # Asegúrate de que el proceso de Django tenga los permisos necesarios (elevación).
                result = subprocess.run(
                    cmd, 
                    capture_output=True, 
                    text=True, 
                    timeout=5,
                    check=True # Lanza CalledProcessError si el código de retorno no es 0
                )
                
                # 3. Actualizar la mitigación en la DB
                mitigacion.activo = True
                mitigacion.resultado = f"IP {ip} bloqueada exitosamente en Windows Firewall (NETSH)"
                mitigacion.fecha_mitigacion = timezone.now() 
                mitigacion.save()
                
                serializer = self.get_serializer(mitigacion)
                return Response(serializer.data, status=status.HTTP_200_OK)
                
            except subprocess.CalledProcessError as e:
                # Captura errores específicos de netsh (ej: acceso denegado o error de sintaxis)
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
        """
        Desactiva una mitigación (activo=True) desbloqueando la IP con NETSH (Windows).
        """
        try:
            mitigacion = self.get_queryset().get(pk=pk, activo=True)
            
            ip = mitigacion.ip
            if not ip or ip == "desconocida":
                return Response({'error': 'IP no válida para desbloquear'}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Desbloquear IP con NETSH (Eliminar la regla)
            try:
                # Comando de Windows: Elimina la regla por su nombre (Bloqueo_IP)
                cmd = [
                    "netsh", "advfirewall", "firewall", "delete", "rule",
                    f"name=Bloqueo_{ip}" # Usa el nombre que se creó al activar: Bloqueo_192.168.0.35
                ]
                
                result = subprocess.run(
                    cmd, 
                    capture_output=True, 
                    text=True, 
                    timeout=5,
                    check=True # Lanza CalledProcessError si el código de retorno no es 0
                )
                
                # 3. Actualizar la mitigación en la DB
                mitigacion.activo = False
                mitigacion.resultado = f"IP {ip} desbloqueada"
                mitigacion.save()
                
                serializer = self.get_serializer(mitigacion)
                return Response(serializer.data, status=status.HTTP_200_OK)
                
            except subprocess.CalledProcessError as e:
                # Captura errores específicos de netsh (ej: regla no existe, acceso denegado)
                error_msg = f'Error al ejecutar NETSH - Delete: {e.stderr}'
                mitigacion.resultado = error_msg
                mitigacion.save()
                return Response({'error': error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({'error': f'Error al desbloquear IP: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Mitigacion.DoesNotExist:
            return Response({'error': 'Mitigación no encontrada o ya está inactiva'}, status=status.HTTP_404_NOT_FOUND)