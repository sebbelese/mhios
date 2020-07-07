from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from library.models import story
from library import customstorage

import json

def index(request):
    currentStory = get_object_or_404(story, pk=674)
    context = {
        'story': currentStory,
    }
    return render(request, 'reader/index.html', context)

def getFileUrl(request):
    if request.method == 'GET':
        story_id = request.GET['story_id']
        currentStory = get_object_or_404(story, pk=int(story_id))
        filename = request.GET['filename']
        filepath = story.storiesPath+'/'+currentStory.buildStoryDirname()+'/'+filename
        storage = customstorage.CustomStorage()
        data = json.dumps({'downloadUrl' : storage.url(filepath)})
        return HttpResponse(data, content_type='application/json')
    else:
        return HttpResponse("Error invalid input")

