from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer

from retman_api.models import Customer, Membership, Visitation, Payment, Cost


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class MembershipSerializer(ModelSerializer):
    color = serializers.IntegerField(read_only=True)
    class Meta:
        model = Membership
        fields = '__all__'


class VisitationSerializer(ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', required=False)

    class Meta:
        model = Visitation
        fields = '__all__'


class VisitationWithCustomerSerializer(ModelSerializer):
    customer = CustomerSerializer(many=False, required=False, read_only=True)

    class Meta:
        model = Visitation
        fields = '__all__'


class PaymentCustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'full_name', 'card_id']


class PaymentSerializer(ModelSerializer):
    customer = PaymentCustomerSerializer()

    class Meta:
        model = Payment
        fields = '__all__'


class CostSerializer(ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', required=False)
    class Meta:
        model = Cost
        fields = '__all__'


class VisitationHeatmapSerializer(Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()


