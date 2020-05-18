from datetime import timedelta, datetime, date

import dateutil
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Sum, Q, F
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from retman_api.serializers import CustomerSerializer, MembershipSerializer, VisitationSerializer, \
    VisitationWithCustomerSerializer, VisitationHeatmapSerializer, PaymentSerializer, \
    MembershipTypeSerializer, TrainerSerializer, ShortCustomerSerializer, ServiceSerializer, PaymentCreateSerializer, \
    NotificationSerializer
from retman_api.models import Customer, Membership, Visitation, Payment, MembershipType, Trainer, Service, Notification


class CustomersViewSet(viewsets.ModelViewSet):
    last_month = datetime.today() - timedelta(days=30)
    queryset = Customer.objects.annotate(count=Count('visit_customer',
        filter=Q(visit_customer__came_at__gte=last_month))).order_by('-count')
    serializer_class = CustomerSerializer

    def get_serializer_class(self):
        if self.action in ('list', 'destroy'):
            return ShortCustomerSerializer
        return CustomerSerializer


class TodayCustomersViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.annotate(count=Count('visit_customer',
        filter=Q(visit_customer__came_at=datetime.today()))).filter(count__gte=1)
    serializer_class = CustomerSerializer


class MembershipTypesViewSet(viewsets.ModelViewSet):
    queryset = MembershipType.objects.all()
    serializer_class = MembershipTypeSerializer


class TrainersViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class MembershipsViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Membership.objects.filter(customer=self.kwargs['customer_id'])

    serializer_class = MembershipSerializer


class TrainersVisitationsView(APIView):
    def post(self, request):
        trainer_data = request.data.get('trainer')
        start_date = parse(request.data.get('start_date'))
        end_date = parse(request.data.get('end_date'))
        end_date = end_date.replace(hour=23, minute=59)

        if trainer_data == 'all':
            visitations = {}
            for trainer in Trainer.objects.all():
                v = Visitation.objects.filter(came_at__range=(start_date, end_date), trainer=trainer)
                visitations[trainer.id] = VisitationWithCustomerSerializer(v, many=True).data
        else:
            trainer = Trainer.objects.get(id=trainer_data)
            v = Visitation.objects.filter(came_at__range=(start_date, end_date), trainer=trainer)
            visitations = {trainer.id: VisitationWithCustomerSerializer(v, many=True).data}

        return Response(visitations)


class CurrentMembershipCreate(APIView):
    def get(self, request, customer_id):
        memberships = Membership.objects.filter(customer=customer_id,
                                                expiration_date__gt=timezone.now(), enrollment_date__lt=timezone.now())
        memberships.order_by('enrollment_date')

        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, customer_id):
        try:
            customer = Customer.objects.get(pk=customer_id)
        except ObjectDoesNotExist:
            return Response('No such customer', status=status.HTTP_400_BAD_REQUEST)

        membership_type = MembershipType.objects.get(id=request.data.get('type'))

        data = request.data.copy()
        data.update({'customer': customer_id, 'available_visitations': membership_type.visitations,
                     'available_group': membership_type.group, 'available_personal': membership_type.personal})

        membership = MembershipSerializer(data=data)
        if membership.is_valid():
            membership_obj = membership.save()

            payment = Payment(value=int(request.data.get('cost', 0)), customer=customer, membership=membership_obj)
            payment.save()

            return Response(membership.data, status=status.HTTP_201_CREATED)
        return Response(membership.errors, status=status.HTTP_400_BAD_REQUEST)


class OpenVisitation(APIView):
    def post(self, request):
        if request.data.get('customer_id'):
            customer = Customer.objects.get(id=request.data['customer_id'])
        elif request.data.get('card_id'):
            customer = Customer.objects.get(
                card_id=request.data.get('card_id'))
        else:
            return Response('No customer specified', status=status.HTTP_400_BAD_REQUEST)

        def not_frozen():
            return Q(freeze_end__isnull=True) | Q(freeze_end__lt=timezone.now())

        visitations = Visitation.objects.filter(left_at__isnull=True, customer=customer)

        memberships = Membership.active(customer)

        type = request.data.get('type')
        data = request.data.copy()
        data.update({'customer': customer.id})
        serializer = VisitationSerializer(data=data)

        if not visitations and type in ['VS', 'PT', 'GT'] and serializer.is_valid():
            if type == 'VS':
                type_unlimited_filter = Q(type__unlimited_visitations=True)
                available_filter = Q(available_visitations__gt=0)
                visitations_to_decrement = 'available_visitations'
            elif type == 'PT':
                type_unlimited_filter = Q(type__unlimited_personal=True)
                available_filter = Q(available_personal__gt=0)
                visitations_to_decrement = 'available_personal'
            else:
                type_unlimited_filter = Q(type__unlimited_group=True)
                available_filter = Q(available_group__gt=0)
                visitations_to_decrement = 'available_group'

            filtered_memberships = memberships.filter(not_frozen(), available_filter)
            if memberships.filter(not_frozen(), type_unlimited_filter).exists():
                pass

            elif filtered_memberships.exists():
                ms = filtered_memberships.order_by('expiration_date').first()
                setattr(ms, visitations_to_decrement, F(visitations_to_decrement) - 1)
                ms.save()

            else:
                return Response('Can not create', status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response('OK', status=status.HTTP_200_OK)

        else:
            return Response('Can not create', status=status.HTTP_400_BAD_REQUEST)


class CurrentVisitation(APIView):
    def get(self, request, customer_id):
        try:
            visitation = Visitation.objects.get(
                left_at__isnull=True, customer=customer_id)
        except ObjectDoesNotExist:
            return Response("Customer don't engage at the moment", status=status.HTTP_400_BAD_REQUEST)

        serializer = VisitationSerializer(visitation)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CloseCurrentVisitation(APIView):
    def get(self, request, customer_id):
        try:
            visitation = Visitation.objects.get(
                left_at__isnull=True, customer=customer_id)
        except ObjectDoesNotExist:
            return Response('There is no active visitation, nothing to close', status=status.HTTP_400_BAD_REQUEST)

        visitation.left_at = timezone.now()
        visitation.save()
        return Response('Closed', status.HTTP_200_OK)


class CloseGroupVisitations(APIView):
    def get(self, request):
        visitations = Visitation.objects.filter(
            left_at__isnull=True, type='GT')
        for visitation in visitations:
            visitation.left_at = timezone.now()
            visitation.save()

        return Response('Closed', status.HTTP_200_OK)


class VisitationsList(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Visitation.objects.filter(customer=self.kwargs['customer_id']).order_by('-id')[:100]

    serializer_class = VisitationWithCustomerSerializer


class CurrentVisitationsList(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        return Visitation.objects.filter(left_at__isnull=True).order_by('-id')

    serializer_class = VisitationWithCustomerSerializer


class VisitationHeatmapView(APIView):
    def get(self, request):
        count_query = Visitation.objects.extra(
            {'date': "date(came_at)"}).values('date').annotate(count=Count('id'))
        return Response(VisitationHeatmapSerializer(count_query, many=True).data, status.HTTP_200_OK)


class PaymentsViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Payment.objects.filter(value__gt=0).order_by('-id')[:10]

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer


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
            membership.freeze_start = parse(request.data.get('freeze_start'))
            membership.freeze_end = membership.freeze_start + timedelta(days=days - 1)
            membership.expiration_date = membership.expiration_date + \
                relativedelta(days=days)
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


class CheckIntroducing(APIView):
    def post(self, request, customer_id):
        try:
            customer = Customer.objects.get(pk=customer_id)
        except ObjectDoesNotExist:
            return Response('No such customer', status=status.HTTP_400_BAD_REQUEST)

        if request.data.get('check'):
            customer.introducing = True
            customer.save()
            return Response('OK', status=status.HTTP_200_OK)

        if request.data.get('uncheck'):
            customer.introducing = False
            customer.save()
            return Response('OK', status=status.HTTP_200_OK)

        return Response('Error happened', status=status.HTTP_400_BAD_REQUEST)


class CustomerName(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(card_id=customer_id)
        except ObjectDoesNotExist:
            return Response('No such customer', status=status.HTTP_400_BAD_REQUEST)

        return Response(customer.full_name, status=status.HTTP_200_OK)


class ServicesViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class StatsView(APIView):

    items = ['total_revenue', 'active_memberships', 'memberships_by_type', 'services', 'visitations',
             'unique_visitations']

    def get(self, request):
        try:
            start_date = parse(request.GET.get('start_date'))
            end_date = parse(request.GET.get('end_date'))
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        data = {func: getattr(self, func)(start_date, end_date) for func in self.items}
        return Response(data)

    @staticmethod
    def total_revenue(start_date, end_date):
        return Payment.objects.filter(date__range=(start_date, end_date)).aggregate(sum=Sum('value'))['sum']

    @staticmethod
    def active_memberships(start_date, end_date):
        return Membership.objects.filter(expiration_date__gt=start_date).count()

    @staticmethod
    def memberships_by_type(start_date, end_date):
        data = []
        for type in MembershipType.objects.all():
            qs = type.memberships.filter(enrollment_date__range=(start_date, end_date))
            cost_sum = qs.aggregate(sum=Sum('cost'))['sum']
            count = qs.count()
            data.append((type.name, count, cost_sum))

        return data

    @staticmethod
    def services(start_date, end_date):
        data = []
        for service in Service.objects.all():
            qs = service.purchases.filter(date__range=(start_date, end_date))
            value_sum = qs.aggregate(sum=Sum('value'))['sum']
            count = qs.count()
            data.append((service.title, count, value_sum))

        return data

    @staticmethod
    def visitations(start_date, end_date):
        return Visitation.objects.filter(came_at__range=(start_date, end_date)).count()

    @staticmethod
    def unique_visitations(start_date, end_date):
        return Visitation.objects.filter(came_at__range=(start_date, end_date)).values('customer_id').distinct().count()


class NotificationsView(APIView):
    def get(self, request):
        qs = Notification.objects.filter(created_at__startswith=date.today())
        if not qs.exists():
            created = False
            bdays = Customer.objects.filter(birth_date__day=date.today().day, birth_date__month=date.today().month)

            for customer in bdays:
                created = True
                Notification.objects.create(customer=customer, text=f'{customer.full_name} - сегодня день рождения.')

            month_ago = date.today() - relativedelta(months=1)
            visitations = Visitation.objects.filter(came_at__startswith=month_ago)
            for visitation in visitations:
                if not Visitation.objects.filter(customer=visitation.customer,
                                                 came_at__gt=month_ago + relativedelta(days=1)).exists():
                    created = True
                    Notification.objects.create(customer=visitation.customer,
                                                text=f'{visitation.customer.full_name} - последнее посещение месяц назад.')

            if not created:
                Notification.objects.create(text='Нет уведомлений')

        return Response(NotificationSerializer(qs, many=True).data, status.HTTP_200_OK)
