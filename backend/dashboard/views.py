from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from ataques.models import Ataque
from conexiones.models import Conexion
from mitigaciones.models import Mitigacion

from rest_framework import serializers, status
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response as DRFResponse

class DashboardStatsSerializer(serializers.Serializer):
    ataques_activos = serializers.IntegerField()
    ataques_hoy = serializers.IntegerField()
    conexiones_hoy = serializers.IntegerField()
    mitigaciones_exitosas = serializers.IntegerField()
    ataques_ultimos_30_dias = serializers.IntegerField()


class ExportJsonSerializer(serializers.Serializer):
    ataques = serializers.ListField(child=serializers.DictField())
    mitigaciones = serializers.ListField(child=serializers.DictField())


@extend_schema(
    responses=DashboardStatsSerializer,
    description="Obtiene estadísticas generales del sistema: ataques activos, ataques del día, conexiones del día, mitigaciones exitosas, etc."
)
class DashboardStatsView(APIView):
    def get(self, request):
        try:
            hoy = timezone.now().date()
            hace_30_dias = hoy - timedelta(days=30)

            data = {
                "ataques_activos": Ataque.objects.filter(activo=True).count(),
                "ataques_hoy": Ataque.objects.filter(fecha_detectado__date=hoy).count(),
                "conexiones_hoy": Conexion.objects.filter(hora__date=hoy).count(),
                "mitigaciones_exitosas": Mitigacion.objects.filter(resultado__icontains='exitoso').count(),
                "ataques_ultimos_30_dias": Ataque.objects.filter(fecha_detectado__date__gte=hace_30_dias).count(),
            }
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(
    responses=ExportJsonSerializer,
    description="Exporta los ataques y mitigaciones detectados en la fecha actual en formato JSON."
)
class ExportJsonView(APIView):
    def get(self, request):
        try:
            hoy = timezone.now().date()

            ataques_hoy = Ataque.objects.filter(
                fecha_detectado__date=hoy
            ).values()

            mitigaciones_hoy = Mitigacion.objects.filter(
                fecha_mitigacion__date=hoy
            ).values()

            data = {
                "ataques": list(ataques_hoy),
                "mitigaciones": list(mitigaciones_hoy),
            }

            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AnalyticsView(APIView):
    """Devuelve datos de ejemplo para el dashboard (hourly, byType, bySeverity)."""
    def get(self, request):
        try:
            data = {
                "hourly": [
                    {"hour": "20:00", "count": 15},
                    {"hour": "21:00", "count": 22},
                    {"hour": "22:00", "count": 18},
                    {"hour": "23:00", "count": 35},
                    {"hour": "00:00", "count": 28},
                    {"hour": "01:00", "count": 12},
                ],
                "byType": [
                    {"name": "DDoS", "value": 400},
                    {"name": "SQL Injection", "value": 300},
                    {"name": "XSS", "value": 300},
                    {"name": "Botnet", "value": 200},
                    {"name": "Phishing", "value": 150},
                ],
                "bySeverity": [
                    {"severity": "Baja", "count": 550},
                    {"severity": "Media", "count": 380},
                    {"severity": "Alta", "count": 150},
                ],
            }

            return DRFResponse(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)