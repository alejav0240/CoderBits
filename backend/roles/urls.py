from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RolViewSet

router = DefaultRouter()
router.register("roles", RolViewSet, basename='roles')

urlpatterns = [
    path('', include(router.urls)),
]