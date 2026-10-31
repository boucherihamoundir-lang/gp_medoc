from django.db import models

class PatientProfile(models.Model):
    BLOOD_GROUPS = (
        ('O+', 'O+ (Donneur universel)'),
        ('A+', 'A+'),
        ('B+', 'B+'),
        ('AB+', 'AB+ (Receveur universel)'),
        ('O-', 'O-'),
        ('A-', 'A-'),
        ('B-', 'B-'),
        ('AB-', 'AB-'),
        ('Inconnu', 'Non déterminé'),
    )

    user_id = models.IntegerField(unique=True, db_index=True)
    civility = models.CharField(max_length=20, default='M.')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, default='M')
    birth_date = models.DateField(null=True, blank=True)
    blood_group = models.CharField(max_length=20, choices=BLOOD_GROUPS, default='O+')
    identity_card_number = models.CharField(max_length=50, blank=True)
    wilaya = models.CharField(max_length=100, default='Alger')
    city = models.CharField(max_length=100, default='Alger')
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    avatar = models.TextField(blank=True, default='')

    # Biométrie & Constantes vitales
    weight = models.FloatField(null=True, blank=True) # en kg
    height = models.FloatField(null=True, blank=True) # en cm
    bmi = models.FloatField(null=True, blank=True)
    blood_pressure = models.CharField(max_length=30, blank=True, default='12/8')
    heart_rate = models.IntegerField(null=True, blank=True, default=72)
    blood_sugar = models.CharField(max_length=30, blank=True, default='0.95 g/L')

    # Contact d'urgence vitale
    emergency_name = models.CharField(max_length=150, blank=True)
    emergency_relation = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=50, blank=True)

    # Dossier Médical Partagé (Antécédents & Traitements)
    allergies = models.JSONField(default=list, blank=True)
    chronic_conditions = models.JSONField(default=list, blank=True)
    current_treatments = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return f"{self.civility} {self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"{self.full_name} ({self.blood_group}) - {self.wilaya}"

class MedicalDocument(models.Model):
    DOC_TYPES = (
        ('analyse', 'Bilan Biologique / Analyse'),
        ('imagerie', 'Radiographie / IRM / Écho'),
        ('ordonnance', 'Ordonnance Pharmacie'),
        ('compte_rendu', 'Compte-rendu Hospitalier'),
        ('autre', 'Autre document médical'),
    )

    patient = models.ForeignKey(PatientProfile, related_name='documents', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    doc_type = models.CharField(max_length=50, choices=DOC_TYPES, default='analyse')
    doctor_name = models.CharField(max_length=150, blank=True)
    file_data = models.TextField(blank=True) # Base64 ou URL de fichier
    file_size = models.CharField(max_length=50, default='450 Ko')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.doc_type}) - {self.patient.full_name}"
