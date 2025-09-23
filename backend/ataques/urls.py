from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import AtaqueViewSet

router = DefaultRouter()
router.register("ataques", AtaqueViewSet, basename='ataques')

urlpatterns = [
    path('', include(router.urls)),
]