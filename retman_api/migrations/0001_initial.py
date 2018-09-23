# Generated by Django 2.0.6 on 2018-09-23 16:11

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_id', models.IntegerField()),
                ('full_name', models.CharField(max_length=150, unique=True)),
                ('birth_date', models.DateField(blank=True)),
                ('phone_number', models.CharField(blank=True, max_length=50)),
                ('amount_of_available_visitations', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enrollment_date', models.DateField(default=datetime.date(2018, 9, 23))),
                ('months', models.IntegerField(default=1)),
                ('expiration_date', models.DateField()),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='retman_api.Customer')),
            ],
        ),
        migrations.CreateModel(
            name='Visitation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('came_at', models.DateTimeField(auto_now_add=True)),
                ('left_at', models.DateTimeField(blank=True)),
                ('key_number', models.IntegerField(blank=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='retman_api.Customer')),
            ],
        ),
    ]
