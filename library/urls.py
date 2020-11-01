from django.urls import  path


from . import views

app_name = 'library'

urlpatterns = [
    path('', views.index, name='index'),
    path('editStory<int:storyId>/', views.editStory, name='editStory'),
    path('voteStory', views.voteStory, name='voteStory'),
    path('addStory/',views.addStory, name='addStory'),
    path('uploadStoryFile',views.uploadStoryFile, name='uploadStoryFile'),
    path('uploadStoryDone',views.uploadStoryDone, name='uploadStoryDone'),
    path('deleteStoryPath',views.deleteStoryPath, name='deleteStoryPath'),
    path('getStoryFilesListAndSize', views.getStoryFilesListAndSize, name='getStoryFilesListAndSize'),
    path('getStoryFileLink', views.getStoryFileLink, name='getStoryFileLink'),
    path('toUserLibrary',views.toUserLibrary, name='toUserLibrary'),
]
