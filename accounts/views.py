from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import SignUpForm
from django.utils.translation import get_language

def signup(request):
    if request.method == 'POST':
        f = SignUpForm(request.POST)
        if f.is_valid():
            f.save()
            messages.success(request, 'Account created successfully')
            return redirect('signup')
    else:
        f = SignUpForm(initial={'language': get_language()})
    return render(request, 'accounts/signup.html', {'form': f})

