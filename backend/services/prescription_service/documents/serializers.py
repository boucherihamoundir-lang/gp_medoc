from rest_framework import serializers
from .models import Prescription, PrescriptionItem, MedicalCertificate

class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ['id', 'medication', 'dosage', 'duration', 'notes']

class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, required=False)

    class Meta:
        model = Prescription
        fields = [
            'id', 'doctor_id', 'doctor_name', 'doctor_specialty', 'cabinet_name',
            'patient_id', 'patient_name', 'patient_age', 'diagnosis', 'notes',
            'items', 'created_at'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        prescription = Prescription.objects.create(**validated_data)
        for item in items_data:
            PrescriptionItem.objects.create(prescription=prescription, **item)
        return prescription

class MedicalCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalCertificate
        fields = [
            'id', 'doctor_id', 'doctor_name', 'patient_id', 'patient_name',
            'cert_type', 'description', 'duration_days', 'created_at'
        ]
