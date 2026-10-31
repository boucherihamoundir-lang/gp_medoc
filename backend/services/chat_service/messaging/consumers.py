import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import ChatRoom, ChatMessage

class MedicalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"medical_{self.room_name}"

        # Rejoindre le groupe de discussion
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Quitter le groupe
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        sender_role = data.get('sender_role', 'patient')
        sender_name = data.get('sender_name', 'Utilisateur')
        text = data.get('text', '')
        attachment = data.get('attachment', None)

        # Sauvegarder le message en base de données
        msg = await self.save_message(
            self.room_name, sender_id, receiver_id, sender_role, sender_name, text, attachment
        )

        # Diffuser le message à tous les participants du canal
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': msg.id,
                    'sender_id': sender_id,
                    'receiver_id': receiver_id,
                    'sender_role': sender_role,
                    'sender_name': sender_name,
                    'text': text,
                    'attachment': attachment,
                    'time': timezone.now().strftime('%H:%M')
                }
            }
        )

    async def chat_message(self, event):
        # Envoyer les données reçues sur la WebSocket du client
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def save_message(self, room_name, sender_id, receiver_id, sender_role, sender_name, text, attachment):
        room, _ = ChatRoom.objects.get_or_create(
            room_name=room_name,
            defaults={
                'patient_id': sender_id if sender_role == 'patient' else receiver_id,
                'doctor_id': receiver_id if sender_role == 'patient' else sender_id,
                'patient_name': sender_name if sender_role == 'patient' else 'Patient',
                'doctor_name': sender_name if sender_role == 'doctor' else 'Docteur',
            }
        )
        time_str = timezone.now().strftime('%H:%M')
        room.last_message = text if text else (f"Document: {attachment.get('title')}" if attachment else "")
        room.last_time = time_str
        room.save()

        return ChatMessage.objects.create(
            room=room,
            sender_id=sender_id,
            receiver_id=receiver_id,
            sender_role=sender_role,
            sender_name=sender_name,
            text=text,
            attachment=attachment
        )
