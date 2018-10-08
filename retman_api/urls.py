from django.urls import path

from retman_api.views import CustomersViewSet, CurrentMembershipCreate, MembershipsList, CurrentVisitation, \
    VisitationsList, CurrentVisitationsList, CloseCurrentVisitation, AddVisitationsView, VisitationHeatmapView, \
    PaymentsList, PaymentsOverview, CostsViewSet, CloseGroupVisitations, OpenVisitation

app_name = 'retman_api'

urlpatterns = [
    path('customers/', CustomersViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('customers/<int:pk>/', CustomersViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})),
    path('customers/<int:customer_id>/membership/', CurrentMembershipCreate.as_view(), name='current_membership_create'),
    path('customers/<int:customer_id>/memberships/', MembershipsList.as_view({'get': 'list'}), name='memberships_list'),
    path('customers/<int:customer_id>/visitation/', CurrentVisitation.as_view(), name='current_visitation'),
    path('customers/<int:customer_id>/visitations/', VisitationsList.as_view({'get': 'list'}), name='visitations_list'),
    path('customers/<int:customer_id>/visitations/add/', AddVisitationsView.as_view(), name='add_visitations'),
    path('customers/<int:customer_id>/visitation/close/', CloseCurrentVisitation.as_view(), name='close_visitation'),
    path('visitations/', CurrentVisitationsList.as_view({'get': 'list'}), name='current_visitations_list'),
    path('visitations/open/', OpenVisitation.as_view(), name='open_visitation'),
    path('visitations/close_group/', CloseGroupVisitations.as_view(), name='close_group_visitations'),
    path('visitations/get_data_heatmap/', VisitationHeatmapView.as_view(), name='heatmap'),
    path('payments/', PaymentsList.as_view({'get': "list"}), name="payments"),
    path('payments/overview/', PaymentsOverview.as_view(), name="payments_overview"),
    path('costs/', CostsViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('costs/<int:pk>/', CostsViewSet.as_view({'delete': 'destroy'})),

]