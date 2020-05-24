from django.contrib import admin
from .models import story

class storyAdmin(admin.ModelAdmin):
    pass

admin.site.register(story, storyAdmin)
