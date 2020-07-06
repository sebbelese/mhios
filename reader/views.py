from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from library.models import story

def index(request):
    currentStory = get_object_or_404(story, pk=326)
    context = {
        'story': currentStory,
    }
    return render(request, 'reader/index.html', context)
