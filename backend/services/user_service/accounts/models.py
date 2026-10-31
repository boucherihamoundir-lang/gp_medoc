from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('doctor', 'Médecin Praticien'),
        ('patient', 'Patient'),
        ('admin', 'Administrateur'),
    )

    CIVILITY_CHOICES = (
        ('Dr.', 'Docteur (Dr.)'),
        ('Pr.', 'Professeur (Pr.)'),
        ('M.', 'Monsieur (M.)'),
        ('Mme', 'Madame (Mme)'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient', db_index=True)
    civility = models.CharField(max_length=10, choices=CIVILITY_CHOICES, default='M.', blank=True)
    phone = models.CharField(max_length=30, blank=True)
    wilaya = models.CharField(max_length=100, blank=True)
    avatar = models.TextField(blank=True, default='')  # Base64 string ou URL personnalisée
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role}) - {self.get_full_name()}"
