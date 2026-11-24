from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer
)

User = get_user_model()

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    """Permet aux services internes et praticiens de lister les utilisateurs par rôle"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)
        return queryset

class VerifyTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "valid": True,
            "user_id": request.user.id,
            "username": request.user.username,
            "role": request.user.role
        }, status=status.HTTP_200_OK)

class AuthRootView(APIView):
    """Index interactif de l'API User & Auth Service"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "service": "MEDOC - User & Auth Service (Microservice 1)",
            "port": 8001,
            "status": "online",
            "description": "Gestion des utilisateurs, authentification JWT et comptes praticiens/patients",
            "endpoints": {
                "register": "/api/v1/auth/register/",
                "login": "/api/v1/auth/login/",
                "profile": "/api/v1/auth/profile/",
                "users": "/api/v1/auth/users/",
                "token_refresh": "/api/v1/auth/token/refresh/",
                "verify": "/api/v1/auth/verify/",
                "admin": "/admin/"
            }
        })
