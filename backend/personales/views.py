from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import Personal
from .serializers import PersonalSerializer

class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all()
    serializer_class = PersonalSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"], url_path="activos")
    def listar_activos(self, request):
        queryset = Personal.objects.filter(activo=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="inactivos")
    def listar_inactivos(self, request):
        queryset = Personal.objects.filter(activo=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="restaurar")
    def restaurar(self, request, pk=None):
        try:
            personal = Personal.objects.get(pk=pk, activo=False)
            personal.activo = True
            personal.save()
            return Response({"detail": "Usuario restaurado exitosamente"}, status=status.HTTP_200_OK)
        except Personal.DoesNotExist:
            return Response({"detail": "Usuario no encontrado o ya está activo"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["get"], url_path="activo")
    def obtener_activo(self, request, pk=None):
        try:
            personal = Personal.objects.get(pk=pk, activo=True)
        except Personal.DoesNotExist:
            return Response({"detail": "No encontrado o inactivo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(personal)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="inactivo")
    def obtener_inactivo(self, request, pk=None):
        try:
            personal = Personal.objects.get(pk=pk, activo=False)
        except Personal.DoesNotExist:
            return Response({"detail": "No encontrado o activo"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(personal)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='eliminar')
    def eliminar_usuario(self, request, pk=None):
        try:
            personal = Personal.objects.get(pk=pk, activo=True)
            personal.activo = False
            personal.save()
            return Response({"message": "El usuario ha sido eliminado correctamente."}, status=status.HTTP_200_OK)
        except Personal.DoesNotExist:
            return Response({"message": "Usuario no encontrado o ya está inactivo."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_personal(request):
    usuario = request.data.get('usuario')
    contrasena = request.data.get('contrasena')

    if not usuario or not contrasena:
        return Response({'detail': 'Usuario y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        personal = Personal.objects.get(usuario=usuario, activo=True)
    except Personal.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado o inactivo'}, status=status.HTTP_404_NOT_FOUND)

    if not check_password(contrasena, personal.contrasena):
        return Response({'detail': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken()
    refresh['user_id'] = personal.id
    refresh['usuario'] = personal.usuario
    refresh['rol'] = personal.rol.nombre_rol if personal.rol else None 

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'usuario': personal.usuario,
        'rol': personal.rol.nombre_rol if personal.rol else None,
        'message': 'Inicio de sesión exitoso'
    }, status=status.HTTP_200_OK)