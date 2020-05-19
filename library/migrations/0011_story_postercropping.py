# Generated by Django 3.0.5 on 2020-05-16 21:11

from django.db import migrations
import image_cropping.fields


class Migration(migrations.Migration):

    dependencies = [
        ('library', '0010_auto_20200516_2308'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='posterCropping',
            field=image_cropping.fields.ImageRatioField('poster', '300x300', adapt_rotation=False, allow_fullsize=False, free_crop=False, help_text=None, hide_image_field=False, size_warning=False, verbose_name='posterCropping'),
        ),
    ]
