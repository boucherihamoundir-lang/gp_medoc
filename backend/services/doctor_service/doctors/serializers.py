from rest_framework import serializers
from .models import DoctorProfile, Tarif, WeeklySchedule

class TarifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarif
        fields = ['id', 'title', 'price', 'reimbursement']

class WeeklyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklySchedule
        fields = ['id', 'day', 'start_time', 'end_time', 'is_active']

class DoctorProfileSerializer(serializers.ModelSerializer):
    tarifs = TarifSerializer(many=True, read_only=True)
    schedules = WeeklyScheduleSerializer(many=True, read_only=True)
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user_id', 'civility', 'first_name', 'last_name', 'full_name',
            'specialty', 'rpps', 'cabinet_name', 'address', 'wilaya', 'city',
            'phone_office', 'phone_emergency', 'email', 'avatar', 'bio',
            'teleconsultation_enabled', 'access_pmr', 'convention_sector',
            'slot_duration', 'rating', 'review_count', 'tarifs', 'schedules',
            'created_at', 'updated_at'
        ]
