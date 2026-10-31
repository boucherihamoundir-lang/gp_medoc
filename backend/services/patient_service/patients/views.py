from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PatientProfile, MedicalDocument
from .serializers import PatientProfileSerializer, MedicalDocumentSerializer

class PatientProfileManageView(APIView):
    """Consultation et modification de son propre profil médical par le patient connecté"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        profile, _ = PatientProfile.objects.get_or_create(
            user_id=user_id,
            defaults={
                'first_name': getattr(request.user, 'first_name', 'Patient'),
                'last_name': getattr(request.user, 'last_name', ''),
                'email': getattr(request.user, 'email', ''),
            }
        )
        serializer = PatientProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        user_id = request.user.id
        profile, _ = PatientProfile.objects.get_or_create(user_id=user_id)
        serializer = PatientProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientDetailByUserIdView(generics.RetrieveAPIView):
    """Permet à un praticien de consulter le dossier médical d'un patient par user_id"""
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'user_id'
    queryset = PatientProfile.objects.all()

class PatientListView(generics.ListAPIView):
    """Liste des patients pour les praticiens"""
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = PatientProfile.objects.all().order_by('-created_at')

class PatientDocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalDocument.objects.filter(patient__user_id=self.request.user.id).order_by('-created_at')

    def perform_create(self, serializer):
        profile, _ = PatientProfile.objects.get_or_create(user_id=self.request.user.id)
        serializer.save(patient=profile)
