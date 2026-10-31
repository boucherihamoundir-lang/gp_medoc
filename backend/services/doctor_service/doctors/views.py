from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import models
from .models import DoctorProfile
from .serializers import DoctorProfileSerializer

class DoctorListView(generics.ListAPIView):
    """Recherche & annuaire public des praticiens pour les patients"""
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = DoctorProfile.objects.all().order_by('-rating')
        specialty = self.request.query_params.get('specialty', None)
        wilaya = self.request.query_params.get('wilaya', None)
        teleconsult = self.request.query_params.get('teleconsultation', None)
        q = self.request.query_params.get('q', None)

        if specialty:
            queryset = queryset.filter(specialty__icontains=specialty)
        if wilaya:
            queryset = queryset.filter(wilaya__icontains=wilaya)
        if teleconsult is not None and teleconsult.lower() == 'true':
            queryset = queryset.filter(teleconsultation_enabled=True)
        if q:
            queryset = queryset.filter(
                models.Q(first_name__icontains=q) |
                models.Q(last_name__icontains=q) |
                models.Q(specialty__icontains=q) |
                models.Q(cabinet_name__icontains=q) |
                models.Q(city__icontains=q)
            )
        return queryset

class DoctorDetailView(generics.RetrieveAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]

class DoctorProfileManageView(APIView):
    """Mise à jour ou création du profil praticien (authentifié)"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        profile, _ = DoctorProfile.objects.get_or_create(
            user_id=user_id,
            defaults={
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'email': request.user.email,
            }
        )
        serializer = DoctorProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        user_id = request.user.id
        profile, _ = DoctorProfile.objects.get_or_create(user_id=user_id)
        serializer = DoctorProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
