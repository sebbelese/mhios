from django.urls import include, path
from django_email_verification import urls as mail_urls

from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('confirmation/<email>', views.confirmation, name='confirmation'),
    path('email/', include(mail_urls)),
    path('', include('django.contrib.auth.urls')),
]
