from django.urls import path
from rest_framework.routers import DefaultRouter

from retman_api.views import CustomersViewSet, CurrentMembershipCreate, MembershipsList

router = DefaultRouter()
router.register('customers', CustomersViewSet, base_name='customers')

urlpatterns = [
    path('customers/<int:customer_id>/membership/', CurrentMembershipCreate.as_view(), name='current_membership_create'),
    path('customers/<int:customer_id>/memberships/', MembershipsList, name='memberships_list'),
]

urlpatterns += router.urls
