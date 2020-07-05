import os
from django import forms
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.base import ContentFile
import uuid
from PIL import Image
import json

from .models import story

class addStoryForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
         self.user = kwargs.pop('user',None)
         super(addStoryForm, self).__init__(*args, **kwargs)
         
    x = forms.FloatField(widget=forms.HiddenInput(), required=False)
    y = forms.FloatField(widget=forms.HiddenInput(), required=False)
    width = forms.FloatField(widget=forms.HiddenInput(), required=False)
    height = forms.FloatField(widget=forms.HiddenInput(), required=False)
    rotation = forms.FloatField(widget=forms.HiddenInput(), required=False)
    
    class Meta:
        model = story
        fields = ('title','abstract','age','language','poster', 'x', 'y', 'width', 'height','rotation')
        labels = {"poster": str(_("Poster"))+" ("+str(_("Optional"))+")"}

    def save(self, commit=True):

        story = super(addStoryForm, self).save(commit=False)
        story.pub_date = timezone.now()
        story.uploader = self.user

        x = self.cleaned_data.get('x')
        y = self.cleaned_data.get('y')
        w = self.cleaned_data.get('width')
        h = self.cleaned_data.get('height')
        rot = self.cleaned_data.get('rotation')

        if story.poster != "":
            image = Image.open(story.poster).convert('RGB')
            if (rot is not None):
                image = image.rotate(-rot, expand=True)
            if (x is not None and y is not None and w is not None and h is not None):
                image = image.crop((x, y, w+x, h+y))
            image = image.resize((400, 400), Image.ANTIALIAS)
            imageIO =  BytesIO()
            image.save(imageIO, format='JPEG')
            newPosterFname =  'p'+str(uuid.uuid1())+'.jpg'
            story.poster.name =  newPosterFname
            imageIO.seek(0)
            story.poster.file = InMemoryUploadedFile(
                imageIO,
                'ImageField',
                'poster',
                'image/jpeg',
                imageIO.tell(),
                None
            )        
        else:
            story.poster.save('../assets/defaultPoster.jpg', None)
        story.save()
        return story
        
    
