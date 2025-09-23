from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MitigacionViewSet

router = DefaultRouter()
router.register('mitigaciones', MitigacionViewSet, basename='mitigaciones')

urlpatterns = [
    path('', include(router.urls)),
]
