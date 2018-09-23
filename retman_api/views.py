from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from retman_api.serializers import CustomerSerializer, MembershipSerializer
from retman_api.models import Customer, Membership


class CustomersList(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


class MembershipsList(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Membership.objects.filter(customer=self.kwargs['customer_id'])

    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


class CurrentMembershipCreate(APIView):
    def get(self, request, customer_id):
        memberships = Membership.objects.filter(customer=customer_id).order_by('-enrollment_date')
        if memberships:
            current = memberships[0]
            current_serializer = MembershipSerializer(current)
            return Response(current_serializer.data, status=status.HTTP_200_OK)
        return Response("Customer don't have a membership", status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, customer_id):
        data = request.data
        data += {'customer': customer_id}
        membership = MembershipSerializer(data=data)
        if membership.is_valid():
            membership.save()
            return Response(membership.data, status=status.HTTP_201_CREATED)
        return Response(membership.errors, status=status.HTTP_400_BAD_REQUEST)
