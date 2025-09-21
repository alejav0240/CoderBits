from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RolViewSet, PersonalViewSet, ConexionViewSet, AtaqueViewSet, MitigacionViewSet

router = DefaultRouter()
router.register("roles", RolViewSet)
router.register("personales", PersonalViewSet)
router.register("conexiones", ConexionViewSet)
router.register("ataques", AtaqueViewSet)
router.register("mitigaciones", MitigacionViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
