from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('getFileUrl', views.getFileUrl, name='getFileUrl')
]
