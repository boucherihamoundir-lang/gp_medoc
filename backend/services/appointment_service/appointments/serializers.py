from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_id', 'doctor_id', 'patient_name', 'patient_phone',
            'doctor_name', 'doctor_specialty', 'date', 'time', 'duration',
            'type', 'reason', 'status', 'notes', 'amount',
            'created_at', 'updated_at'
        ]
