# Generated by Django 3.1.2 on 2021-01-30 20:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20210130_2054'),
    ]

    operations = [
        migrations.RenameField(
            model_name='projectmodel',
            old_name='nb_regected',
            new_name='nb_rejected',
        ),
    ]
