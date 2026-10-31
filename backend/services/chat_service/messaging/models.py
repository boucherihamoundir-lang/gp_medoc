from django.db import models

class ChatRoom(models.Model):
    room_name = models.CharField(max_length=150, unique=True, db_index=True)
    patient_id = models.IntegerField(db_index=True)
    doctor_id = models.IntegerField(db_index=True)
    patient_name = models.CharField(max_length=150)
    doctor_name = models.CharField(max_length=150)
    last_message = models.TextField(blank=True, default='')
    last_time = models.CharField(max_length=30, blank=True, default='')
    unread_for_doctor = models.IntegerField(default=0)
    unread_for_patient = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Chat [{self.room_name}]: {self.patient_name} <-> {self.doctor_name}"

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender_id = models.IntegerField(db_index=True)
    receiver_id = models.IntegerField(db_index=True)
    sender_role = models.CharField(max_length=20, default='patient') # 'doctor' ou 'patient'
    sender_name = models.CharField(max_length=150)
    text = models.TextField()
    attachment = models.JSONField(null=True, blank=True) # {title, size, icon, url, type}
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender_name} [{self.created_at.strftime('%H:%M')}]: {self.text[:30]}"
