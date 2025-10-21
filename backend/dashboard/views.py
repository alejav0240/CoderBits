from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from ataques.models import Ataque
from conexiones.models import Conexion
from mitigaciones.models import Mitigacion

from rest_framework import serializers, status
from drf_spectacular.utils import extend_schema

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