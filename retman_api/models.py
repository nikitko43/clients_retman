from datetime import date

from django.db import models


class Customer(models.Model):
    card_id = models.IntegerField()
    full_name = models.CharField(max_length=150, unique=True)
    birth_date = models.DateField(blank=True)
    phone_number = models.CharField(blank=True)
    amount_of_available_visitations = models.IntegerField(default=0)

    def __str__(self):
        return self.full_name


class Membership(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    enrollment_date = models.DateField(default=date.today())
    months = models.IntegerField(default=1)
    expiration_date = models.DateField()

    def save(self, *args, **kwargs):
        from dateutil.relativedelta import relativedelta

        # Вопрос: добавлять всегда 30 дней или честный месяц?
        self.expiration_date = self.enrollment_date + relativedelta(months=self.months)
        super(Membership, self).save(*args)

    def __str__(self):
        return self.customer.full_name + ', до ' + self.expiration_date


class Visitation(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    came_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(blank=True)
    key_number = models.IntegerField(blank=True)