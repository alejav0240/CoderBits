from django.urls import path
from .views import DashboardStatsView, ExportJsonView, AnalyticsView

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/export/json/', ExportJsonView.as_view(), name='export-json'),
    path('dashboard/analytics/', AnalyticsView.as_view(), name='dashboard-analytics'),
]
