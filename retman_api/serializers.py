from datetime import datetime

from django.db.models import Sum, Q
from django.utils import timezone
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer

from retman_api.models import Customer, Membership, Visitation, Payment, MembershipType, Trainer


class CustomerSerializer(ModelSerializer):
    available = serializers.SerializerMethodField(read_only=True)

    def get_available(self, customer):
        memberships = Membership.active(customer)
        return {'visitations': memberships.aggregate(sum=Sum('available_visitations'))['sum'] or 0,
                'group': memberships.aggregate(sum=Sum('available_group'))['sum'] or 0,
                'personal': memberships.aggregate(sum=Sum('available_personal'))['sum'] or 0}

    class Meta:
        model = Customer
        fields = '__all__'


class MembershipTypeSerializer(ModelSerializer):
    class Meta:
        model = MembershipType
        fields = '__all__'


class TrainerSerializer(ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'


class MembershipSerializer(ModelSerializer):
    color = serializers.SerializerMethodField(read_only=True)
    membership_type = serializers.SerializerMethodField(read_only=True)

    def get_color(self, obj):
        if obj.expiration_date:
            days_remaining = obj.expiration_date - datetime.now()
            if days_remaining.days < 7:
                return 1
        return 0

    def get_membership_type(self, obj):
        return MembershipTypeSerializer(obj.type).data

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


class VisitationHeatmapSerializer(Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()


