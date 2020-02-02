from django.urls import path

from retman_crm.views import CustomerView, DashboardView, RedirectToCustomerView, RetmanLoginView, StatsView, \
    ActivityView

app_name = 'retman_crm'

urlpatterns = [
    path('login/', RetmanLoginView.as_view(), name='login'),
    path('', RetmanLoginView.as_view()),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('redirect_to_customer/', RedirectToCustomerView.as_view(), name='redirect_card_id'),
    path('customer/<int:customer_id>', CustomerView.as_view(), name='customer'),
    path('stats/', StatsView.as_view(), name='stats'),
    path('activity/', ActivityView.as_view(), name='activity'),
]
