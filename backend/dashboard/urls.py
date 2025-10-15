from django.urls import path
from .views import DashboardStatsView, ExportJsonView

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/export/json/', ExportJsonView.as_view(), name='export-json'),
]
