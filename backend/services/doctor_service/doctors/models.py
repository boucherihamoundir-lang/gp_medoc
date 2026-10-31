from django.db import models

class DoctorProfile(models.Model):
    user_id = models.IntegerField(unique=True, db_index=True)
    civility = models.CharField(max_length=20, default='Dr.')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=150, default='Médecine Générale', db_index=True)
    rpps = models.CharField(max_length=50, blank=True)
    cabinet_name = models.CharField(max_length=200, default='Cabinet Médical MEDOC')
    address = models.CharField(max_length=300, blank=True)
    wilaya = models.CharField(max_length=100, default='Alger', db_index=True)
    city = models.CharField(max_length=100, default='Alger')
    phone_office = models.CharField(max_length=50, blank=True)
    phone_emergency = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    avatar = models.TextField(blank=True, default='')
    bio = models.TextField(blank=True)
    teleconsultation_enabled = models.BooleanField(default=True)
    access_pmr = models.BooleanField(default=True)
    convention_sector = models.CharField(max_length=100, default='Secteur Conventionné')
    slot_duration = models.IntegerField(default=20) # en minutes
    rating = models.FloatField(default=4.9)
    review_count = models.IntegerField(default=18)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return f"{self.civility} {self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"{self.full_name} ({self.specialty} - {self.wilaya})"

class Tarif(models.Model):
    doctor = models.ForeignKey(DoctorProfile, related_name='tarifs', on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    reimbursement = models.CharField(max_length=100, default='Pris en charge à 80%')

    def __str__(self):
        return f"{self.title}: {self.price} DZD"

class WeeklySchedule(models.Model):
    doctor = models.ForeignKey(DoctorProfile, related_name='schedules', on_delete=models.CASCADE)
    day = models.CharField(max_length=20) # Lundi, Mardi...
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.day}: {self.start_time} - {self.end_time}"
