from rest_framework import serializers
from .models import PatientProfile, MedicalDocument

class MedicalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalDocument
        fields = ['id', 'title', 'doc_type', 'doctor_name', 'file_data', 'file_size', 'created_at']

class PatientProfileSerializer(serializers.ModelSerializer):
    documents = MedicalDocumentSerializer(many=True, read_only=True)
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = PatientProfile
        fields = [
            'id', 'user_id', 'civility', 'first_name', 'last_name', 'full_name',
            'gender', 'birth_date', 'blood_group', 'identity_card_number',
            'wilaya', 'city', 'phone', 'email', 'avatar',
            'weight', 'height', 'bmi', 'blood_pressure', 'heart_rate', 'blood_sugar',
            'emergency_name', 'emergency_relation', 'emergency_phone',
            'allergies', 'chronic_conditions', 'current_treatments',
            'documents', 'created_at', 'updated_at'
        ]
