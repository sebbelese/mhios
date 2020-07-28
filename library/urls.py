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
    path('getStoryFilesListAndSize', views.getStoryFilesListAndSize, name='getStoryFilesListAndSize'),
    path('getStoryFileLink', views.getStoryFileLink, name='getStoryFileLink'),
    path('toUserLibrary',views.toUserLibrary, name='toUserLibrary'),
]
