from django.urls import path

from . import views

app_name = "reader"

urlpatterns = [
    path('', views.index, name='index'),
    path('getFileUrl', views.getFileUrl, name='getFileUrl'),
    path('switchLibrary',views.switchLibrary, name='switchLibrary'),
]
