# Generated by Django 5.1.5 on 2025-01-17 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0025_player_mfa_secret'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='mfa_secret',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]
