from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def index(request):
    context = {
    }
    return render(request, 'myopenstories/index.html', context)

def legal(request):
    context = {
    }
    return render(request, 'myopenstories/legal.html', context)

def temp():
    return redirect(to="/static/67b0777720d6114131453d1c0f3ff020.txt")
