from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import SignUpForm
from django.utils.translation import get_language
from django_email_verification import sendConfirm

def signup(request):
    if request.method == 'POST':
        f = SignUpForm(request.POST)
        if f.is_valid():
            user = f.save()
            messages.success(request, 'Account created successfully')
            sendConfirm(user)
            return redirect('/accounts/confirmation/'+str(f.cleaned_data.get('email')))
    else:
        f = SignUpForm(initial={'language': get_language()})
    return render(request, 'accounts/signup.html', {'form': f})

def confirmation(request, email):
    if request.method == 'GET':
        return render(request, 'accounts/confirmation.html', {'email' : email})
    

