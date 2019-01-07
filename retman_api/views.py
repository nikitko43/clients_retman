from datetime import timedelta, datetime, date
from dateutil.relativedelta import relativedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Sum
from django.utils import timezone
from django.views.generic import ListView
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from retman_api.serializers import CustomerSerializer, MembershipSerializer, VisitationSerializer, \
    VisitationWithCustomerSerializer, VisitationHeatmapSerializer, PaymentSerializer, CostSerializer
from retman_api.models import Customer, Membership, Visitation, Payment, Cost


class CustomersViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.annotate(count=Count('visit_customer')).order_by('-count')
    serializer_class = CustomerSerializer


class MembershipsList(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Membership.objects.filter(customer=self.kwargs['customer_id'])[:100]

    serializer_class = MembershipSerializer


class CurrentMembershipCreate(APIView):
    def get(self, request, customer_id):
        memberships = Membership.objects.filter(customer=customer_id,
                                                expiration_date__gt=timezone.now(), enrollment_date__lt=timezone.now())
        memberships.order_by('-enrollment_date')

        if memberships:
            current = memberships.first()
            current_serializer = MembershipSerializer(current)
            return Response(current_serializer.data, status=status.HTTP_200_OK)
        return Response("Customer don't have a membership", status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, customer_id):
        memberships = Membership.objects.filter(customer=customer_id,
                                                expiration_date__gt=timezone.now(), enrollment_date__lt=timezone.now())
        if not memberships:
            data = request.data.copy()
            data.update({'customer': customer_id})
            membership = MembershipSerializer(data=data)
            if membership.is_valid():
                membership.save()

                payment = Payment(type='MS', value=int(request.data.get('value', 2000)))
                payment.save()

                return Response(membership.data, status=status.HTTP_201_CREATED)
            return Response(membership.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response('Can not create, there is an active membership', status=status.HTTP_400_BAD_REQUEST)


class OpenVisitation(APIView):
    def post(self, request):
        if request.data.get('customer_id'):
            customer_id = request.data['customer_id']
        elif request.data.get('card_id'):
            customer_id = Customer.objects.get(card_id=request.data.get('card_id')).id
        else:
            return Response('No customer specified', status=status.HTTP_400_BAD_REQUEST)

        visitations = Visitation.objects.filter(left_at__isnull=True, customer=customer_id)
        customer = Customer.objects.get(pk=customer_id)
        membership = Membership.objects.filter(customer=customer_id,
                                                expiration_date__gt=timezone.now(), enrollment_date__lt=timezone.now())

        type = request.data.get('type')
        data = request.data.copy()
        data.update({'customer': customer_id})
        serializer = VisitationSerializer(data=data)

        if not visitations and type in ['VS', 'PT', 'GT']:
            if membership and not membership.first().freeze_end and type == 'VS' and serializer.is_valid():
                pass

            elif membership and membership.first().freeze_end <= date.today() and type == 'VS':
                pass

            elif customer.amount_of_available_visitations != 0 and type == 'VS' and serializer.is_valid():
                customer.amount_of_available_visitations -= 1

            elif customer.amount_of_available_personal != 0 and type == 'PT' and serializer.is_valid():
                customer.amount_of_available_personal -= 1

            elif customer.amount_of_available_group != 0 and type == 'GT' and serializer.is_valid():
                customer.amount_of_available_group -= 1

            else:
                return Response('Can not create', status=status.HTTP_400_BAD_REQUEST)

            customer.save()
            serializer.save()
            return Response('OK', status=status.HTTP_200_OK)

        else:
            return Response('Can not create', status=status.HTTP_400_BAD_REQUEST)


class CurrentVisitation(APIView):
    def get(self, request, customer_id):
        try:
            visitation = Visitation.objects.get(left_at__isnull=True, customer=customer_id)
        except ObjectDoesNotExist:
            return Response("Customer don't engage at the moment", status=status.HTTP_400_BAD_REQUEST)

        serializer = VisitationSerializer(visitation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CloseCurrentVisitation(APIView):
    def get(self, request, customer_id):
        try:
            visitation = Visitation.objects.get(left_at__isnull=True, customer=customer_id)
        except ObjectDoesNotExist:
            return Response('There is no active visitation, nothing to close', status=status.HTTP_400_BAD_REQUEST)

        visitation.left_at = timezone.now()
        visitation.save()
        return Response(VisitationSerializer(visitation).data, status.HTTP_200_OK)


class CloseGroupVisitations(APIView):
    def get(self, request):
        visitations = Visitation.objects.filter(left_at__isnull=True, type='GT')
        for visitation in visitations:
            visitation.left_at = timezone.now()
            visitation.save()

        return Response('Closed', status.HTTP_200_OK)


class VisitationsList(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Visitation.objects.filter(customer=self.kwargs['customer_id']).order_by('-id')[:100]

    serializer_class = VisitationSerializer


class AddVisitationsView(APIView):
    def post(self, request, customer_id):
        try:
            customer = Customer.objects.get(pk=customer_id)
        except ObjectDoesNotExist:
            return Response('No such customer', status=status.HTTP_400_BAD_REQUEST)

        amount = int(request.data.get('amount', 0))
        type = request.data.get('type')

        if type == 'VS':
            customer.amount_of_available_visitations += amount
        elif type == 'PT':
            customer.amount_of_available_personal += amount
        elif type == 'GT':
            customer.amount_of_available_group += amount
        else:
            return Response('No such type', status.HTTP_400_BAD_REQUEST)

        customer.save()

        payment = Payment(type=type, value=int(request.data.get('value', 0)))
        payment.save()

        return Response('OK', status.HTTP_200_OK)


class CurrentVisitationsList(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Visitation.objects.filter(left_at__isnull=True).order_by('-id')

    serializer_class = VisitationWithCustomerSerializer


class VisitationHeatmapView(APIView):
    def get(self, request):
        count_query = Visitation.objects.extra({'date': "date(came_at)"}).values('date').annotate(count=Count('id'))
        return Response(VisitationHeatmapSerializer(count_query, many=True).data, status.HTTP_200_OK)


class PaymentsList(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Payment.objects.filter(value__gt=0)

    serializer_class = PaymentSerializer


class PaymentsOverview(APIView):
    def get(self, request):
        data = {}
        last_week = Payment.objects.filter(date__gt=timezone.now() - timedelta(days=7)).aggregate(Sum('value'))
        data.update({'last_week': last_week['value__sum']})
        last_month = Payment.objects.filter(date__gt=timezone.now() - timedelta(days=30)).aggregate(Sum('value'))
        data.update({'last_month': last_month['value__sum']})
        last_year = Payment.objects.filter(date__gt=timezone.now() - timedelta(days=365)).aggregate(Sum('value'))
        data.update({'last_year': last_year['value__sum']})
        last_month_ms = Payment.objects.filter(date__gt=timezone.now() - timedelta(days=30), type='MS').aggregate(
            Sum('value'))

        data.update({'last_month_ms': last_month_ms['value__sum'] or 0})
        last_month_vs = Payment.objects.filter(date__gt=timezone.now() - timedelta(days=30), type='VS').aggregate(
            Sum('value'))

        data.update({'last_month_vs': last_month_vs['value__sum'] or 0})
        last_month_pt = Payment.objects.filter(date__gt=timezone.now() - timedelta(days=30), type='PT').aggregate(
            Sum('value'))

        data.update({'last_month_pt': last_month_pt['value__sum'] or 0})
        last_month_gt = Payment.objects.filter(date__gt=timezone.now() - timedelta(days=30), type='GT').aggregate(
            Sum('value'))

        data.update({'last_month_gt': last_month_gt['value__sum'] or 0})
        return Response(data, status=status.HTTP_200_OK)

ListView

class FreezeMembership(APIView):
    def post(self, request, customer_id):
        memberships = Membership.objects.filter(customer=customer_id,
                                                expiration_date__gt=timezone.now(), enrollment_date__lt=timezone.now())

        if not memberships:
            return Response("Customer don't have a membership", status=status.HTTP_400_BAD_REQUEST)
        else:
            membership = memberships.first()

        days = int(request.data.get('days'))

        if not membership.freeze_start and 30 > days > 0:
            membership.freeze_start = datetime.today()
            membership.freeze_end = datetime.today() + timedelta(days=days)
            membership.expiration_date = membership.expiration_date + relativedelta(days=days)
            membership.save()
            Membership.objects.filter(customer=customer_id, expiration_date__gt=timezone.now(),
                                      enrollment_date__lt=timezone.now()).update(
                expiration_date=membership.expiration_date + relativedelta(days=days))

            return Response('OK', status=status.HTTP_200_OK)

        else:
            return Response('Can not freeze', status=status.HTTP_400_BAD_REQUEST)


class SavePhoto(APIView):
    def post(self, request, customer_id):
        try:
            customer = Customer.objects.get(pk=customer_id)
        except ObjectDoesNotExist:
            return Response('No such customer', status=status.HTTP_400_BAD_REQUEST)

        if request.FILES['image']:
            customer.photo = request.FILES['image']
            customer.save()
            return Response('OK', status=status.HTTP_200_OK)
        else:
            return Response('Error happened', status=status.HTTP_400_BAD_REQUEST)


class CostsViewSet(viewsets.ModelViewSet):
    queryset = Cost.objects.all().order_by('-type', 'amount')
    serializer_class = CostSerializer
