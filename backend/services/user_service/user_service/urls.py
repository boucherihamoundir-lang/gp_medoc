from django.contrib import admin
from django.urls import path, include
from accounts.views import AuthRootView

urlpatterns = [
    path('', AuthRootView.as_view(), name='root_index'),
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('accounts.urls')),
]
