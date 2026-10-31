from django.urls import re_path
from .consumers import MedicalChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>[a-zA-Z0-9_\-]+)/$', MedicalChatConsumer.as_asgi()),
]
