from django.urls import path
from retman_api_cash.views import Cash

app_name = 'retman_api_cash'

urlpatterns = [
    path('cash/', Cash.as_view(), name='cash'),
]
