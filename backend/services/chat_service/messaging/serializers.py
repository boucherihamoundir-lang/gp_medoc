from rest_framework import serializers
from .models import ChatRoom, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = [
            'id', 'room', 'sender_id', 'receiver_id', 'sender_role',
            'sender_name', 'text', 'attachment', 'is_read', 'created_at', 'time'
        ]

    def get_time(self, obj):
        return obj.created_at.strftime('%H:%M')

class ChatRoomSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'room_name', 'patient_id', 'doctor_id', 'patient_name',
            'doctor_name', 'last_message', 'last_time', 'unread_for_doctor',
            'unread_for_patient', 'messages', 'created_at', 'updated_at'
        ]
