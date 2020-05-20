from django import forms
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from PIL import Image

from .models import story

class addStoryForm(forms.ModelForm):
    x = forms.FloatField(widget=forms.HiddenInput())
    y = forms.FloatField(widget=forms.HiddenInput())
    width = forms.FloatField(widget=forms.HiddenInput())
    height = forms.FloatField(widget=forms.HiddenInput())
    rotation = forms.FloatField(widget=forms.HiddenInput())
    
    class Meta:
        model = story
        fields = ('title','abstract','age','language','poster','storyFile', 'x', 'y', 'width', 'height')
        labels = {"poster": str(_("Poster"))+" ("+str(_("Optional"))+")"}
        
    def save(self, commit=True):
        story = super(addStoryForm, self).save(commit=False)
        story.pub_date = timezone.now()
        story.save()
        x = self.cleaned_data.get('x')
        y = self.cleaned_data.get('y')
        w = self.cleaned_data.get('width')
        h = self.cleaned_data.get('height')
        rot = self.cleaned_data.get('rotation')

        image = Image.open(story.poster)
        rotated_image = image.rotate(-rot, expand=True)
        cropped_image = rotated_image.crop((x, y, w+x, h+y))
        resized_image = cropped_image.resize((400, 400), Image.ANTIALIAS)
        resized_image.save(story.poster.path)
        
        return story
        
    
