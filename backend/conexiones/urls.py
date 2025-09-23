from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConexionViewSet

router = DefaultRouter()
router.register('conexiones', ConexionViewSet, basename='conexiones')

urlpatterns = [
    path('', include(router.urls)),
]