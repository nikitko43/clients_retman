from django.contrib import admin
from django.urls import path, re_path, include

urlpatterns = [
    re_path(r'api/v1/', include('retman_api.urls', namespace='retman_api')),
    re_path(r'^', include('frontend.urls', namespace='frontend')),
    path('admin/', admin.site.urls),
]
