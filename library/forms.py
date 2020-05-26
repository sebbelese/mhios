from django import forms
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from PIL import Image

from .models import story

class addStoryForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
         self.user = kwargs.pop('user',None)
         super(MyForm, self).__init__(*args, **kwargs)
         
    x = forms.FloatField(widget=forms.HiddenInput(), required=False)
    y = forms.FloatField(widget=forms.HiddenInput(), required=False)
    width = forms.FloatField(widget=forms.HiddenInput(), required=False)
    height = forms.FloatField(widget=forms.HiddenInput(), required=False)
    rotation = forms.FloatField(widget=forms.HiddenInput(), required=False)
    
    class Meta:
        model = story
        fields = ('title','abstract','age','language','poster','storyFile', 'x', 'y', 'width', 'height','rotation')
        labels = {"poster": str(_("Poster"))+" ("+str(_("Optional"))+")"}
        
    def save(self, commit=True):
        story = super(addStoryForm, self).save(commit=False)
        story.pub_date = timezone.now()
        story.uploader = self.user
        story.save()
        x = self.cleaned_data.get('x')
        y = self.cleaned_data.get('y')
        w = self.cleaned_data.get('width')
        h = self.cleaned_data.get('height')
        rot = self.cleaned_data.get('rotation')

        image = Image.open(story.poster)
        if (x and y and w and h and rot):
            image = image.rotate(-rot, expand=True)
            image = image.crop((x, y, w+x, h+y))
        image = image.resize((400, 400), Image.ANTIALIAS)
        image.save(story.poster.path)
        
        return story
        
    
