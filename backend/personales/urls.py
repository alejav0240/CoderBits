from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonalViewSet
from .views import PersonalViewSet, login_personal

router = DefaultRouter()
router.register('personales', PersonalViewSet, basename='personales')

urlpatterns = [
    path('personales/login_personal/', login_personal, name='login_personal'),
    path('', include(router.urls)),
]