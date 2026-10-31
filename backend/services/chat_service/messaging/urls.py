from django.urls import path
from .views import ChatRoomListCreateView, ChatMessageListCreateView

urlpatterns = [
    path('', ChatRoomListCreateView.as_view(), name='chat_room_list_create'),
    path('<str:room_name>/messages/', ChatMessageListCreateView.as_view(), name='chat_messages'),
]
