# Generated by Django 2.0.6 on 2018-09-28 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('retman_api', '0009_auto_20180927_1842'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='birth_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
