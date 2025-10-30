from rest_framework import viewsets, status, serializers, filters
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from personales.pagination import CustomPagination
from .models import Personal
from .serializers import PersonalSerializer
from drf_spectacular.utils import extend_schema
from .models import BlacklistedToken
from django_filters.rest_framework import DjangoFilterBackend

class PersonalViewSet(viewsets.ModelViewSet):
    queryset = Personal.objects.all().order_by('-fecha_registro')
    serializer_class = PersonalSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['activo', 'rol']
    search_fields = ['nombre', 'apellido', 'correo']

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

class LoginRequestSerializer(serializers.Serializer):
    usuario = serializers.CharField()
    contrasena = serializers.CharField()

class LoginResponseSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()
    usuario = serializers.CharField()
    rol = serializers.CharField(allow_null=True)
    message = serializers.CharField()

# ==============================
# VISTA LOGIN
# ==============================

@extend_schema(
    request=LoginRequestSerializer,
    responses={200: LoginResponseSerializer},
    description="Permite el inicio de sesión del personal. Devuelve los tokens de autenticación JWT y la información básica del usuario."
)
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_personal(request):
    try:
        refresh_token = request.data.get("refresh")
        access_token = request.data.get("access")

        if not refresh_token or not access_token:
            return Response({"error": "Se requiere refresh y access token"}, status=status.HTTP_400_BAD_REQUEST)

        # Blacklist refresh token
        refresh = RefreshToken(refresh_token)
        refresh.blacklist()

        # Blacklist access token
        BlacklistedToken.objects.create(token=access_token)

        return Response({"message": "Logout exitoso. Tokens invalidados."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)