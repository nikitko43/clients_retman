from rest_framework.serializers import ModelSerializer

from retman_api.models import Customer, Membership


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class MembershipSerializer(ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'


class VisitationSerializer(ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'
