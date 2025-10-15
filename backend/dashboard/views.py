from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from ataques.models import Ataque
from conexiones.models import Conexion
from mitigaciones.models import Mitigacion

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
            return Response({"error": str(e)})


class ExportJsonView(APIView):
    def get(self, request):
        try:
            hoy = timezone.now().date()
            hace_30_dias = hoy - timedelta(days=30)

            data = {
                "ataques": list(Ataque.objects.all().values()),
                "conexiones": list(Conexion.objects.filter(hora__date__gte=hace_30_dias).values()),
                "mitigaciones": list(Mitigacion.objects.all().values()),
            }
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)})
