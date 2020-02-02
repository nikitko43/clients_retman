from django.contrib import admin
from django.urls import path, re_path, include

urlpatterns = [
    re_path(r'v1/', include('retman_api.urls', namespace='retman_api')),
    re_path(r'^', include('retman_crm.urls', namespace='retman_crm')),
    re_path(r'v1/', include('retman_api_cash.urls', namespace='retman_api_cash')),
    path('admin/', admin.site.urls),
]
