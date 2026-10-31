from django.db import models

class Appointment(models.Model):
    TYPE_CHOICES = (
        ('presentiel', 'Consultation Présentielle au Cabinet'),
        ('teleconsultation', 'Téléconsultation Vidéo en Ligne'),
        ('urgence', 'Consultation Urgente'),
        ('domicile', 'Visite Médicale à Domicile'),
    )

    STATUS_CHOICES = (
        ('confirmed', 'Confirmé'),
        ('waiting', 'En Salle d\'Attente'),
        ('in_progress', 'En Consultation'),
        ('completed', 'Terminé / Effectué'),
        ('cancelled', 'Annulé'),
    )

    patient_id = models.IntegerField(db_index=True)
    doctor_id = models.IntegerField(db_index=True)
    patient_name = models.CharField(max_length=150)
    patient_phone = models.CharField(max_length=50, blank=True)
    doctor_name = models.CharField(max_length=150)
    doctor_specialty = models.CharField(max_length=150, default='Médecine Générale')
    date = models.DateField(db_index=True)
    time = models.CharField(max_length=20) # ex: "09:30"
    duration = models.IntegerField(default=20) # en minutes
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='presentiel')
    reason = models.CharField(max_length=300, default='Consultation médicale')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='confirmed', db_index=True)
    notes = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=2500.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"RDV [{self.date} {self.time}] {self.patient_name} -> {self.doctor_name} ({self.status})"
