# Generated by Django 3.0.5 on 2020-05-16 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library', '0009_auto_20200516_2224'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='story',
            name='posterCropping',
        ),
        migrations.AlterField(
            model_name='story',
            name='poster',
            field=models.ImageField(default='posters/default.jpg', upload_to='posters', verbose_name='Poster'),
        ),
    ]
