from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from library.models import story
from library import customstorage

import json

def index(request):
    if request.method == "GET" and 'startStoryId' in request.GET:
        storyId = int(request.GET.get('startStoryId'))
    else:
        storyId = -1

    startStoryIdx = -1
    showUserLib = storyId < 0 and request.user.is_authenticated
    if showUserLib: #No specific story selected and authenticated user with non empty library: default is user library
        isUserLib = True
        storiesList = [ story_instance.id for story_instance in story.objects.all() if request.user in story_instance.inUserLibrary.all()]
        if len(storiesList) == 0:
            showUserLib = False
    if not showUserLib: #Specific story selected or unauthenticated user or user with empty list:  default is global library
        isUserLib = False
        storiesList = [ story_instance.id for story_instance in story.objects.all()]
        if storyId >= 0: #A story is selected
            startStoryIdx = storiesList.index(storyId)
        
    context = {
        'isUserLibrary' : isUserLib,
        'storiesId' : json.dumps(storiesList),
        'startStoryId' : startStoryIdx
    }
    return render(request, 'reader/index.html', context)



@login_required
def switchLibrary(request):
    if request.method == 'GET':
        isUserLibrary = request.GET['is_user_library'] == "true"


        
        if isUserLibrary: #Authenticated user with non empty library: default is user library
            storiesList = [ story_instance.id for story_instance in story.objects.all() if request.user in story_instance.inUserLibrary.all()]
            if len(storiesList) == 0:
                isUserLibrary = False
        if not isUserLibrary: #Unauthenticated user or user with empty list:  default is global library
            storiesList = [ story_instance.id for story_instance in story.objects.all()]
        
        data = json.dumps({
            'isUserLibrary' : isUserLibrary,
            'storiesId' : json.dumps(storiesList),
            'startStoryId' : -1
        })
        return HttpResponse(data, content_type='application/json')
    else:
        return HttpResponse("Error invalid input")


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

