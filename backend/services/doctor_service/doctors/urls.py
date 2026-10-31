from django.urls import path
from .views import DoctorListView, DoctorDetailView, DoctorProfileManageView

urlpatterns = [
    path('', DoctorListView.as_view(), name='doctor_list'),
    path('profile/', DoctorProfileManageView.as_view(), name='doctor_profile_manage'),
    path('<int:pk>/', DoctorDetailView.as_view(), name='doctor_detail'),
]
