from django.urls import path

from frontend.views import RetmanLoginView, DashboardView, RedirectToCustomerView, TrainersView, ActivityView, \
    CustomerView, StatsView, RetmanLogoutView, MembershipsView

app_name = 'frontend'
urlpatterns = [
    path('activity/', ActivityView.as_view()),
    path('customer/<int:pk>/', CustomerView.as_view(), name='customer'),
    path('login/', RetmanLoginView.as_view(), name='login'),
    path('logout/', RetmanLogoutView.as_view(), name='logout'),
    path('', RetmanLoginView.as_view()),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('redirect_to_customer/', RedirectToCustomerView.as_view(), name='redirect_card_id'),
    path('trainers/', TrainersView.as_view()),
    path('memberships/', MembershipsView.as_view()),
    path('stats/', StatsView.as_view()),
]

