# Generated by Django 2.1.2 on 2018-12-29 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('retman_api', '0002_customer_notes'),
    ]

    operations = [
        migrations.AddField(
            model_name='visitation',
            name='note',
            field=models.TextField(blank=True, default=''),
        ),
    ]
