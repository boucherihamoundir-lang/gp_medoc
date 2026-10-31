from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import ChatRoom, ChatMessage
from .serializers import ChatRoomSerializer, ChatMessageSerializer

class ChatRoomListCreateView(generics.ListCreateAPIView):
    """Lister les discussions de l'utilisateur ou en créer une nouvelle"""
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        return ChatRoom.objects.filter(Q(doctor_id=user_id) | Q(patient_id=user_id)).prefetch_related('messages')

class ChatMessageListCreateView(generics.ListCreateAPIView):
    """Historique des messages par salon de discussion"""
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_name = self.kwargs['room_name']
        return ChatMessage.objects.filter(room__room_name=room_name).order_by('created_at')

    def perform_create(self, serializer):
        room_name = self.kwargs['room_name']
        room = ChatRoom.objects.get(room_name=room_name)
        msg = serializer.save(room=room)

        room.last_message = msg.text
        room.last_time = msg.created_at.strftime('%H:%M')
        room.save()
