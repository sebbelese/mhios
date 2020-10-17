from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import UserCreationForm
from .models import User



class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email', 'username', 'password1', 'password2', )

    email = forms.EmailField(max_length=254)
    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.fields['username'].help_text = None
        self.fields['password1'].help_text = None
        self.fields['password2'].help_text = None

class EditUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'username')

    email = forms.EmailField(max_length=254)
    def __init__(self, *args, **kwargs):
        super(forms.ModelForm, self).__init__(*args, **kwargs)
        self.fields['username'].help_text = None
        self.fields['email'].widget.attrs['readonly'] = True
        #self.fields['password1'].help_text = None
        #self.fields['password2'].help_text = None
    
