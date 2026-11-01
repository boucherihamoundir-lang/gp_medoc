from django.urls import path
from .views import (
    PatientProfileManageView,
    PatientDetailByUserIdView,
    PatientListView,
    PatientDocumentListCreateView
)

urlpatterns = [
    path('', PatientListView.as_view(), name='patient_list_root'),
    path('profile/', PatientProfileManageView.as_view(), name='patient_profile_manage'),
    path('list/', PatientListView.as_view(), name='patient_list'),
    path('user/<int:user_id>/', PatientDetailByUserIdView.as_view(), name='patient_detail_by_user'),
    path('documents/', PatientDocumentListCreateView.as_view(), name='patient_documents'),
]
