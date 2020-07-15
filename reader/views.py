from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse

from library.models import story
from library import customstorage

import json

def index(request):
    if request.user.is_authenticated:
        context = {
            'storiesId' : json.dumps([ story_instance.id for story_instance in story.objects.all() if request.user in story_instance.inUserLibrary.all()])
        }
    else:
        context = {
            'storiesId' : json.dumps([ story_instance.id for story_instance in story.objects.all()])
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

