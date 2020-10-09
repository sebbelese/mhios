"""myopenstories URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include,path
from django.conf.urls.i18n import i18n_patterns
from django.utils.translation import activate
from django.contrib.staticfiles.urls import static
from . import settings
from machina import urls as machina_urls

from . import views


urlpatterns = i18n_patterns(
    path('', views.index, name='index'),
    path('legal', views.legal, name='legal'),
    path('reader/', include(('reader.urls','reader'))),
    path('library/', include(('library.urls','library'))),
    path('accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),
    path('forum/', include((machina_urls))),
    path('i18n/', include('django.conf.urls.i18n')),
)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
