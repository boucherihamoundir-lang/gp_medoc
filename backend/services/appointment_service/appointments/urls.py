from django.urls import path
from .views import AppointmentListCreateView, AppointmentDetailView, UpdateAppointmentStatusView

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='appointment_list_create'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
    path('<int:pk>/status/', UpdateAppointmentStatusView.as_view(), name='appointment_status_update'),
]
