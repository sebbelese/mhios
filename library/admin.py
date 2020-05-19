from django.contrib import admin
from image_cropping import ImageCroppingMixin
from .models import story

class storyAdmin(ImageCroppingMixin, admin.ModelAdmin):
    pass

admin.site.register(story, storyAdmin)
