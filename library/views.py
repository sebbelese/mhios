from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader
from django.utils.translation import get_language
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

import json
import uuid

from .models import story, LANGUAGE_CHOICES_DICT, AGE_CHOICES_DICT
from .forms import addStoryForm
from . import customstorage

@login_required
def voteStory(request):
    story_id = None
    if request.method == 'GET':
        story_id = request.GET['story_id']
        vote = request.GET['vote']
        isButtonUp = False
        isButtonDown = False
        if story_id:
            currentStory = get_object_or_404(story, pk=story_id)
            if request.user in currentStory.upvotes.all():
                currentStory.upvotes.remove(request.user)
                if vote == 'down': #From positive to negative
                    currentStory.downvotes.add(request.user)
                    isButtonDown = True
            elif request.user in currentStory.downvotes.all():
                currentStory.downvotes.remove(request.user)
                if vote == 'up': #From negative back to neutral
                    currentStory.upvotes.add(request.user)
                    isButtonUp = True
            else:
                if vote == 'up': #From neutral to positive
                    currentStory.upvotes.add(request.user)
                    isButtonUp = True
                else: #From neutral to negative
                    currentStory.downvotes.add(request.user)
                    isButtonDown = True

            currentStory.save()
            data = json.dumps({
                'score': currentStory.score(),
                'isButtonUp': isButtonUp,
                'isButtonDown': isButtonDown,
            })            
    return HttpResponse(data, content_type='application/json')


@login_required
def toUserLibrary(request):
    story_id = None
    if request.method == 'GET':
        story_id = request.GET['story_id']
        currentStory = get_object_or_404(story, pk=story_id)
        if request.user in currentStory.inUserLibrary.all():
            currentStory.inUserLibrary.remove(request.user)
            added = False;
        else:
            currentStory.inUserLibrary.add(request.user)
            added = True;
        data = json.dumps({
            'added': added,
        })            
    return HttpResponse(data, content_type='application/json')


def index(request):
    langChoice = ""
    ageChoice = ""
    sortChoice = "pub_date"
    stories_list = story.objects.order_by('-'+sortChoice)
    if request.method == 'GET':
        if 'language' in request.GET and request.GET.get('language') != "":
            langChoice = request.GET.get('language')
            stories_list = stories_list.filter(language=langChoice)
        if 'age' in request.GET and request.GET.get('age') != "":
            ageChoice = request.GET.get('age')
            stories_list = stories_list.filter(age=ageChoice)
        if 'sort' in request.GET and request.GET.get('sort') != "":
            sortChoice = request.GET.get('sort')
            if sortChoice == 'title' or sortChoice == 'age' or sortChoice == 'upoader': 
                stories_list = stories_list.order_by(request.GET.get('sort'))
            elif sortChoice == 'pub_date':
                stories_list = stories_list.order_by('-pub_date')
            elif sortChoice == 'score':
                stories_list = sorted(stories_list, key= lambda st: -st.score())
        if 'page' in request.GET:
            page_number = request.GET.get('page')
        else:
            page_number = 1
    paginator = Paginator(stories_list, 10)

    stories_list = paginator.get_page(page_number)

    context = {
        'stories_list': stories_list,
        'languageDict': LANGUAGE_CHOICES_DICT,
        'ageDict': AGE_CHOICES_DICT,
        'langChoice': langChoice,
        'ageChoice': ageChoice,
        'sortChoice': sortChoice,
    }
    return render(request, 'library/index.html', context)


def watchStory(request, storyId):
    currentStory = get_object_or_404(story, pk=storyId)
    response = "You're looking at story %s. Title is %s"%(storyId,currentStory.title)
    context = {
        'story':currentStory,
        'language':LANGUAGE_CHOICES_DICT[currentStory.language]
    }
    return render(request, 'library/watchStory.html', context)

@login_required
def uploadStoryFile(request):
    if request.method == 'GET':
        story_id = request.GET['story_id']
        currentStory = get_object_or_404(story, pk=story_id)
        if currentStory.uploadReady == False:
            filename = request.GET['filename']
            upFile = story.storiesPath+'/'+currentStory.buildStoryDirname()+'/'+filename
            storage = customstorage.CustomStorage()
            [savedFullFilename, uploadUrl] = storage.getUploadLink(upFile)
            data = json.dumps({'uploadUrl' : uploadUrl.link})
            return HttpResponse(data, content_type='application/json')
        else:
            return HttpResponse("Error: forbidden")
    else:
        return HttpResponse("Error: invalid input")

@login_required
def uploadStoryDone(request):
    if request.method == 'GET':
        story_id = request.GET['story_id']
        currentStory = get_object_or_404(story, pk=story_id)
        currentStory.uploadReady = True
        currentStory.save(update_fields=["uploadReady"])
        return HttpResponse("")
    else:
        return HttpResponse("Error invalid input")


def getStoryFilesList(request):
    if request.method == 'GET':
        story_id = request.GET['story_id']
        currentStory = get_object_or_404(story, pk=story_id)
        if currentStory is not None and currentStory.uploadReady == True:
            currentStory.save(update_fields=["uploadReady"])
            return HttpResponse("")
        else:
            return HttpResponse(data, content_type='application/json')
    else:
        return HttpResponse("Error invalid input")

@login_required
def addStory(request):
    if request.method == "POST":
        currentStoryForm = addStoryForm(request.POST, request.FILES, user=request.user)
        if currentStoryForm.is_valid():
            currentStory = currentStoryForm.save()
            storyId = currentStory.id
            data = json.dumps({'storyId' : storyId})
            return HttpResponse(data, content_type='application/json')
        else:
            return HttpResponse("Error invalid input")
    else:
        form = addStoryForm(initial={'language': get_language()})
        return render(request, 'library/addStory.html', {'form': form})

    

