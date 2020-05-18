from django.contrib import admin
from django.urls import path

from retman_api.views import CustomersViewSet, CurrentMembershipCreate, MembershipsViewSet, CurrentVisitation, \
    VisitationsList, CurrentVisitationsList, CloseCurrentVisitation, VisitationHeatmapView, \
    PaymentsViewSet, CloseGroupVisitations, OpenVisitation, FreezeMembership, SavePhoto, \
    CheckIntroducing, CustomerName, TodayCustomersViewSet, MembershipTypesViewSet, TrainersVisitationsView, \
    ServicesViewSet, StatsView, TrainersViewSet, NotificationsView

app_name = 'retman_api'

urlpatterns = [
    path('customers/', CustomersViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('customers/today/', TodayCustomersViewSet.as_view({'get': 'list'})),
    path('customers/<int:pk>/', CustomersViewSet.as_view({'get': 'retrieve', 'put': 'update', 'post': 'partial_update',
                                                          'delete': 'destroy'})),
    path('customers/<int:customer_id>/membership/', CurrentMembershipCreate.as_view(), name='current_membership_create'),
    path('customers/<int:customer_id>/membership/freeze/', FreezeMembership.as_view(), name='freeze_membership'),
    path('customers/<int:customer_id>/memberships/', MembershipsViewSet.as_view({'get': 'list'}),
         name='memberships_list'),
    path('customers/<int:customer_id>/memberships/<int:pk>/',
         MembershipsViewSet.as_view({'post': 'partial_update', 'delete': 'destroy'}), name='memberships_list'),
    path('customers/<int:customer_id>/visitation/', CurrentVisitation.as_view(), name='current_visitation'),
    path('customers/<int:customer_id>/visitations/', VisitationsList.as_view({'get': 'list'}), name='visitations_list'),
    path('customers/<int:customer_id>/visitation/close/', CloseCurrentVisitation.as_view(), name='close_visitation'),
    path('customers/<int:customer_id>/photo/', SavePhoto.as_view(), name='save_photo'),
    path('customers/<int:customer_id>/introducing/', CheckIntroducing.as_view(), name='check_introducing'),
    path('customers/<int:customer_id>/name/', CustomerName.as_view(), name='customer_name'),
    path('visitations/', CurrentVisitationsList.as_view({'get': 'list'}), name='current_visitations_list'),
    path('visitations/open/', OpenVisitation.as_view(), name='open_visitation'),
    path('visitations/close_group/', CloseGroupVisitations.as_view(), name='close_group_visitations'),
    path('visitations/get_data_heatmap/', VisitationHeatmapView.as_view(), name='heatmap'),
    path('services/', ServicesViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('trainers_visitations/', TrainersVisitationsView.as_view(), name="trainers_visitations"),
    path('payments/', PaymentsViewSet.as_view({'get': "list", 'post': "create"}), name="payments"),
    path('trainers/', TrainersViewSet.as_view({'get': "list", 'post': 'create'}), name="trainers"),
    path('trainers/<int:pk>/', TrainersViewSet.as_view({'put': 'update', 'delete': 'destroy'}), name="trainers_update"),
    path('membership_types/', MembershipTypesViewSet.as_view({'get': 'list', 'post': 'create'}), name="membership_types"),
    path('membership_types/<int:pk>/', MembershipTypesViewSet.as_view({'post': 'update', 'delete': 'destroy'})),
    path('stats/', StatsView.as_view(), name='stats'),
    path('notifications/', NotificationsView.as_view()),
    path('admin/', admin.site.urls),
]