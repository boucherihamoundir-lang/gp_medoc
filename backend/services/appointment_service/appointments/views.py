from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentListCreateView(generics.ListCreateAPIView):
    """Lister les rendez-vous selon l'utilisateur (médecin ou patient) ou créer un nouveau rendez-vous"""
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        queryset = Appointment.objects.filter(Q(doctor_id=user_id) | Q(patient_id=user_id))

        date = self.request.query_params.get('date', None)
        status_param = self.request.query_params.get('status', None)
        doctor_id = self.request.query_params.get('doctor_id', None)
        patient_id = self.request.query_params.get('patient_id', None)

        if date:
            queryset = queryset.filter(date=date)
        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param)
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save()

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Appointment.objects.all()

class UpdateAppointmentStatusView(APIView):
    """Mise à jour rapide du statut d'un rendez-vous (ex: passer en salle d'attente ou terminé)"""
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({"error": "Rendez-vous introuvable."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if not new_status or new_status not in dict(Appointment.STATUS_CHOICES):
            return Response({"error": "Statut invalide."}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = new_status
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)
