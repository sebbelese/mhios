from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import SignUpForm, EditUserForm
from django.utils.translation import get_language
from django_email_verification import sendConfirm
from .models import User
from django.contrib.auth.decorators import login_required

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
    

@login_required
def editUser(request):
    if request.method == 'POST':
        f = EditUserForm(request.POST, instance=request.user)
        if f.is_valid():
            user = f.save()
    else:
        f = EditUserForm(instance=request.user)
    return render(request, 'accounts/edituser.html', {'form': f})

@login_required
def deleteUser(request):
    context = {}
    context['email'] = str(request.user)
    request.user.is_active = False
    request.user.save()
    return render(request, 'accounts/userdeleted.html', context=context) 
