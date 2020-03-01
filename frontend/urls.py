from django.urls import path

from frontend.views import RetmanLoginView, DashboardView, RedirectToCustomerView
from . import views


app_name = 'frontend'
urlpatterns = [
    path('activity', views.ActivityView.as_view()),
    path('customer/<int:pk>/', views.CustomerView.as_view(), name='customer'),
    path('login/', RetmanLoginView.as_view(), name='login'),
    path('', RetmanLoginView.as_view()),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('redirect_to_customer/', RedirectToCustomerView.as_view(), name='redirect_card_id'),
]

