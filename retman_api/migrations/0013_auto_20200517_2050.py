# Generated by Django 2.2.10 on 2020-05-17 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('retman_api', '0012_auto_20200505_1813'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trainer',
            name='full_name',
            field=models.CharField(default='Новый тренер', max_length=500),
        ),
    ]