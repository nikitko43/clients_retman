from django.urls import path

from retman_crm.views import CustomerView, DashboardView, RedirectToCustomerView, RetmanLoginView, CostsView, StatsView, \
    ActivityView

app_name = 'retman_crm'

urlpatterns = [
    path('login/', RetmanLoginView.as_view(), name='login'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('redirect_to_customer/', RedirectToCustomerView.as_view(), name='redirect_card_id'),
    path('customer/<int:customer_id>', CustomerView.as_view(), name='customer'),
    path('costs/', CostsView.as_view(), name='costs'),
    path('stats/', StatsView.as_view(), name='stats'),
    path('activity/', ActivityView.as_view(), name='activity'),
]
