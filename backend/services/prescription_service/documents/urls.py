from django.urls import path
from .views import (
    PrescriptionListCreateView,
    PrescriptionDetailView,
    PrescriptionDownloadPDFView,
    MedicalCertificateListCreateView
)

urlpatterns = [
    path('', PrescriptionListCreateView.as_view(), name='prescription_list_create'),
    path('<int:pk>/', PrescriptionDetailView.as_view(), name='prescription_detail'),
    path('<int:pk>/pdf/', PrescriptionDownloadPDFView.as_view(), name='prescription_pdf_download'),
    path('certificates/', MedicalCertificateListCreateView.as_view(), name='certificate_list_create'),
]
