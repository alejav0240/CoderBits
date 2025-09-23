from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from ataques.models import Ataque
from conexiones.models import Conexion
from mitigaciones.models import Mitigacion
from personales.models import Personal

class DashboardStatsView(APIView):
    """
    Vista para obtener estadísticas generales del dashboard
    """
    def get(self, request):
        hoy = timezone.now().date()
        hace_30_dias = hoy - timedelta(days=30)
        
        stats = {
            'ataques_activos': Ataque.objects.filter(activo=True).count(),
            'ataques_hoy': Ataque.objects.filter(
                fecha_detectado__date=hoy
            ).count(),
            'conexiones_hoy': Conexion.objects.filter(
                hora__date=hoy
            ).count(),
            'mitigaciones_exitosas': Mitigacion.objects.filter(
                resultado__icontains='exitoso'
            ).count(),
            'personal_activo': Personal.objects.filter(activo=True).count(),
            'ataques_por_tipo': list(
                Ataque.objects.values('tipo')
                .annotate(total=Count('id'))
                .order_by('-total')[:5]
            ),
            'conexiones_ultimos_30_dias': Conexion.objects.filter(
                hora__date__gte=hace_30_dias
            ).count(),
        }
        
        return Response(stats, status=status.HTTP_200_OK)
