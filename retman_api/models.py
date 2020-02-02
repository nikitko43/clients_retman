from math import floor

from django.db import models
from django.db.models.functions import Trunc
from django.utils import timezone


def image_upload(instance, filename):
    return 'images/user_{0}_image.jpg'.format(instance.id, filename)


class Customer(models.Model):
    card_id = models.IntegerField(unique=True)
    full_name = models.CharField(max_length=150, unique=True)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=50, null=True, blank=True)
    photo = models.FileField(upload_to=image_upload, null=True, blank=True, verbose_name='Фотография')
    who_advised = models.IntegerField(blank=True, null=True)
    introducing = models.BooleanField(default=False)
    amount_of_available_visitations = models.IntegerField(default=0)
    amount_of_available_personal = models.IntegerField(default=0)
    amount_of_available_group = models.IntegerField(default=0)
    passport = models.CharField(max_length=20, null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return self.full_name


class Membership(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='customer')
    enrollment_date = models.DateTimeField(default=timezone.now)
    months = models.FloatField(default=1.0)
    freeze_start = models.DateField(blank=True, null=True)
    freeze_end = models.DateField(blank=True, null=True)
    expiration_date = models.DateTimeField(null=True)
    cost = models.IntegerField(default=2000)

    def save(self, *args, **kwargs):
        from dateutil.relativedelta import relativedelta
        months = floor(self.months)
        self.expiration_date = self.enrollment_date + relativedelta(months=self.months)
        self.expiration_date = self.expiration_date.replace(hour=23, minute=59, second=59)
        super(Membership, self).save(*args)

    def __str__(self):
        return self.customer.full_name + ', до ' + str(self.expiration_date)


class Visitation(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='visit_customer')
    came_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    key_number = models.IntegerField(null=True, blank=True)
    type_choices = (('VS', 'Обычное'), ('PT', 'Персональная тренировка'), ('GT', 'Групповая тренировка'))
    type = models.CharField(max_length=30, choices=type_choices, default='VS')
    note = models.TextField(blank=True, default='')


class Payment(models.Model):
    type_choices = (('MS', 'Абонемент'), ('VS', 'Обычное'), ('PT', 'Персональная тренировка'),
                    ('GT', 'Групповая тренировка'))
    type = models.CharField(max_length=30, choices=type_choices)
    value = models.IntegerField()
    date = models.DateTimeField(default=timezone.now)
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.CASCADE)
    membership = models.ForeignKey(Membership, null=True, blank=True, on_delete=models.CASCADE)


class Cost(models.Model):
    type_choices = (('MS', 'Абонемент'), ('VS', 'Обычное'), ('PT', 'Персональная тренировка'),
                    ('GT', 'Групповая тренировка'))
    type = models.CharField(max_length=30, choices=type_choices, default='MS')
    amount = models.IntegerField()
    value = models.IntegerField()

    class Meta:
        unique_together = ("type", "amount")