from django.urls import  path


from . import views

app_name = 'library'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:storyId>/', views.watchStory, name='watchStory'),
    path('voteStory', views.voteStory, name='voteStory'),
    path('addStory/',views.addStory, name='addStory'),
    path('addStory/uploadStoryFile',views.uploadStoryFile, name='uploadStoryFile'),
    path('addStory/uploadStoryDone',views.uploadStoryDone, name='uploadStoryDone'),
    path('getStoryFilesList', views.getStoryFilesList, name='getStoryFilesList'),
    path('toUserLibrary',views.toUserLibrary, name='toUserLibrary'),
]
