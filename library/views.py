from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.template import loader
from django.urls import reverse
from django.utils.translation import get_language
from django.contrib.auth.decorators import login_required
import json

from .models import story, LANGUAGE_CHOICES_DICT, AGE_CHOICES_DICT
from .forms import addStoryForm



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

def index(request):
    latest_stories_list = story.objects.order_by('-pub_date')
    context = {
        'latest_stories_list': latest_stories_list,
        'languageDict': LANGUAGE_CHOICES_DICT,
        'ageDict': AGE_CHOICES_DICT
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
def addStory(request):
    if request.method == "POST":
        currentStoryForm = addStoryForm(request.POST, request.FILES, user=request.user)
        if currentStoryForm.is_valid():
            currentStory = currentStoryForm.save()
            return redirect('watchStory', storyId=currentStory.id)
        else:
            print(currentStoryForm.errors)
            return HttpResponse("Error invalid input")
    else:
        form = addStoryForm(initial={'language': get_language()})
        return render(request, 'library/addStory.html', {'form': form})
