# Generated by Django 3.0.5 on 2020-10-07 19:32

from django.db import migrations
import verified_email_field.models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=verified_email_field.models.VerifiedEmailField(max_length=254, unique=True, verbose_name='Email'),
        ),
    ]
