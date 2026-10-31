from django.db import models

class Prescription(models.Model):
    doctor_id = models.IntegerField(db_index=True)
    doctor_name = models.CharField(max_length=150)
    doctor_specialty = models.CharField(max_length=150, default='Médecine Générale')
    cabinet_name = models.CharField(max_length=200, default='Cabinet Médical MEDOC')
    patient_id = models.IntegerField(db_index=True)
    patient_name = models.CharField(max_length=150)
    patient_age = models.IntegerField(null=True, blank=True)
    diagnosis = models.CharField(max_length=250, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Ordonnance #{self.id} - Dr. {self.doctor_name} pour {self.patient_name}"

class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(Prescription, related_name='items', on_delete=models.CASCADE)
    medication = models.CharField(max_length=200)
    dosage = models.CharField(max_length=200) # ex: "1 comprimé 3 fois par jour"
    duration = models.CharField(max_length=100) # ex: "Pendant 10 jours"
    notes = models.CharField(max_length=250, blank=True)

    def __str__(self):
        return f"{self.medication} ({self.dosage})"

class MedicalCertificate(models.Model):
    CERT_TYPES = (
        ('aptitude', 'Certificat Médical d\'Aptitude Physique & Sportive'),
        ('arret_travail', 'Arrêt de Travail & Convalescence'),
        ('bonne_sante', 'Certificat de Bonne Santé / Non-Contagion'),
    )

    doctor_id = models.IntegerField(db_index=True)
    doctor_name = models.CharField(max_length=150)
    patient_id = models.IntegerField(db_index=True)
    patient_name = models.CharField(max_length=150)
    cert_type = models.CharField(max_length=50, choices=CERT_TYPES, default='aptitude')
    description = models.TextField()
    duration_days = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Certificat #{self.id} [{self.cert_type}] pour {self.patient_name}"
