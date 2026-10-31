from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.db.models import Q
from .models import Prescription, MedicalCertificate
from .serializers import PrescriptionSerializer, MedicalCertificateSerializer
from .pdf_generator import generate_prescription_pdf

class PrescriptionListCreateView(generics.ListCreateAPIView):
    """Lister les ordonnances du médecin ou du patient, ou en émettre une nouvelle"""
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return Prescription.objects.filter(Q(doctor_id=user_id) | Q(patient_id=user_id)).prefetch_related('items')

class PrescriptionDetailView(generics.RetrieveAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Prescription.objects.all()

class PrescriptionDownloadPDFView(APIView):
    """Téléchargement direct du PDF officiel de l'ordonnance médicale"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            prescription = Prescription.objects.get(pk=pk)
        except Prescription.DoesNotExist:
            return Response({"error": "Ordonnance introuvable."}, status=status.HTTP_404_NOT_FOUND)

        pdf_bytes = generate_prescription_pdf(prescription)
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        filename = f"Ordonnance_MEDOC_{prescription.patient_name.replace(' ', '_')}_{prescription.id}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

class MedicalCertificateListCreateView(generics.ListCreateAPIView):
    """Génération et consultation des certificats médicaux d'aptitude / arrêt"""
    serializer_class = MedicalCertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return MedicalCertificate.objects.filter(Q(doctor_id=user_id) | Q(patient_id=user_id))
