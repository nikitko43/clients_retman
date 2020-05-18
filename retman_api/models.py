from math import floor

from django.db import models
from django.db.models import Q
from django.db.models.functions import Trunc
from django.utils import timezone


def image_upload(instance, filename):
    return 'images/user_{0}_image.jpg'.format(instance.id, filename)


type_choices = (('VS', 'Обычное'), ('PT', 'Персональная тренировка'), ('GT', 'Групповая тренировка'))

type_plural_choices = (('VS', 'Обычные'), ('PT', 'Персональные тренировки'), ('GT', 'Групповые тренировки'))


class Customer(models.Model):
    card_id = models.IntegerField(unique=True)
    full_name = models.CharField(max_length=150, unique=True)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=50, null=True, blank=True)
    photo = models.FileField(upload_to=image_upload, null=True, blank=True, verbose_name='Фотография')
    introducing = models.BooleanField(default=False)
    passport = models.CharField(max_length=20, null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return self.full_name


class MembershipType(models.Model):
    name = models.CharField(max_length=500, default='Новый тип абонемента')
    visitations = models.IntegerField(default=0)
    personal = models.IntegerField(default=0)
    group = models.IntegerField(default=0)
    months = models.FloatField(blank=True, null=True)

    unlimited = models.BooleanField(default=False)

    unlimited_visitations = models.BooleanField(default=False)
    unlimited_personal = models.BooleanField(default=False)
    unlimited_group = models.BooleanField(default=False)

    cost = models.IntegerField(default=0)
    main_type = models.CharField(max_length=10, choices=type_plural_choices, default='VS')

    def __str__(self):
        return self.name


class Membership(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='customer')
    enrollment_date = models.DateTimeField(default=timezone.now)
    freeze_start = models.DateField(blank=True, null=True)
    freeze_end = models.DateField(blank=True, null=True)
    expiration_date = models.DateTimeField(null=True)
    cost = models.IntegerField(default=2000)

    type = models.ForeignKey(MembershipType, null=True, blank=True, on_delete=models.CASCADE,
                             related_name='memberships')

    available_visitations = models.IntegerField(default=0)
    available_personal = models.IntegerField(default=0)
    available_group = models.IntegerField(default=0)

    @staticmethod
    def active(user):
        return Membership.objects.filter(Q(expiration_date__isnull=True) | Q(expiration_date__gt=timezone.now()),
                                         customer=user.id, enrollment_date__lt=timezone.now())

    def save(self, *args, **kwargs):
        if not self.expiration_date and self.type and not self.type.unlimited:
            from dateutil.relativedelta import relativedelta
            months = floor(self.type.months)
            days = floor(30 * (self.type.months - months))
            self.expiration_date = self.enrollment_date + relativedelta(months=months, days=days)
            self.expiration_date = self.expiration_date.replace(hour=23, minute=59, second=59)
        super(Membership, self).save(*args)

    def __str__(self):
        return self.customer.full_name + ', до ' + str(self.expiration_date)


class Trainer(models.Model):
    full_name = models.CharField(max_length=500, default='Новый тренер', blank=True)

    def __str__(self):
        return self.full_name


class Visitation(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True, related_name='visit_customer')
    came_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    key_number = models.IntegerField(null=True, blank=True)
    type = models.CharField(max_length=30, choices=type_choices, default='VS')
    note = models.TextField(blank=True, default='')
    trainer = models.ForeignKey(Trainer, blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'{self.customer.full_name}, {self.came_at}'


class Service(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title


class Payment(models.Model):
    value = models.IntegerField()
    date = models.DateTimeField(default=timezone.now)
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL)
    membership = models.ForeignKey(Membership, null=True, blank=True, on_delete=models.SET_NULL)
    service = models.ForeignKey(Service, blank=True, null=True, on_delete=models.SET_NULL, related_name='purchases')
    type = models.CharField(max_length=100, choices=(('cash', 'Наличный'), ('card', 'Безналичный'), ('', '')),
                            blank=True, null=True)

    def __str__(self):
        result = ''
        if self.customer:
            result += f'{self.customer.card_id} {self.customer.full_name}, '
        if self.membership:
            result += f'{self.membership.type.name if self.membership.type else "абонемент"}, '
        if self.service:
            result += f'{self.service.title}, '
        return result + f'{self.date.strftime("%d %B %Y %-H:%M")}, {self.value}р'

    class Meta:
        permissions = [("can_see_stats", "Can see statistics page")]


class RecognitionResult(models.Model):
    card_id = models.CharField(max_length=5, blank=True, null=True)
    datetime = models.DateTimeField(auto_now_add=True)
    guid = models.CharField(max_length=100)
    url = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.card_id}, {self.datetime}'


class Notification(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=3000)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.text
