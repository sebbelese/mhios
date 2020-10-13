from django.urls import include, path
from django_email_verification import urls as mail_urls
import django.contrib.auth.views as auth_views
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('confirmation/<email>', views.confirmation, name='confirmation'),
    path('email/', include(mail_urls)),
    path('password_reset/', auth_views.PasswordResetView.as_view(html_email_template_name='registration/password_reset_email.html')),
    path('', include('django.contrib.auth.urls')),
]
