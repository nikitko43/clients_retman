from math import floor

from django.db import models
from django.db.models import Q
from django.db.models.functions import Trunc
from django.utils import timezone


def image_upload(instance, filename):
    return 'images/user_{0}_image.jpg'.format(instance.id, filename)


type_choices = (('VS', 'Обычное'), ('PT', 'Персональная тренировка'), ('GT', 'Групповая тренировка'))

type_plural_choices = (('VS', 'Обычные'), ('PT', 'Персональные тренировки'), ('GT', 'Групповые тренировки'))

payment_type_choices = (('MS', 'Абонемент'), ('VS', 'Обычное'), ('PT', 'Персональная тренировка'),
                        ('GT', 'Групповая тренировка'))


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
    name = models.CharField(max_length=500)
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

    type = models.ForeignKey(MembershipType, null=True, blank=True, on_delete=models.CASCADE)

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
    full_name = models.CharField(max_length=500)

    def __str__(self):
        return self.full_name


class Visitation(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='visit_customer')
    came_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    key_number = models.IntegerField(null=True, blank=True)
    type = models.CharField(max_length=30, choices=type_choices, default='VS')
    note = models.TextField(blank=True, default='')
    trainer = models.ForeignKey(Trainer, blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'{self.customer.full_name}, {self.came_at}'


class Payment(models.Model):
    type = models.CharField(max_length=30, choices=payment_type_choices)
    value = models.IntegerField()
    date = models.DateTimeField(default=timezone.now)
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.CASCADE)
    membership = models.ForeignKey(Membership, null=True, blank=True, on_delete=models.CASCADE)
