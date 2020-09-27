from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.translation import get_language
from django.conf import settings

from . import customstorage


LANGUAGE_CHOICES= [
    ('fr', _('French')),
    ('en', _('English')),
    ('es', _('Spanish'))
    ]

AGE_CHOICES = [
    ('3to4',_('3 to 4 y/o')),
    ('5to6',_('5 to 6 y/o')),
    ('7to9',_('7 to 9 y/o')),
    ('10to99',_('10 y/o and +'))
    ]

LICENSE_CHOICES = [
    ('CC-0',_('Creative Commons Zero (Public Domain)')),
    ('CC-BY',_('Creative Commons Attribution')),
    ('CC-BY-SA',_('Creative Commons Attribution-ShareAlike')),
    ('CC-BY-ND',_('Creative Commons Attribution-NoDerivs')),
    ('CC-BY-NC',_('Creative Commons Attribution-NonCommercial')),
    ('CC-BY-NC-SA',_('Creative Commons Attribution-NonCommercial-ShareAlike')),
    ('CC-BY-NC-ND',_('Creative Commons Attribution-NonCommercial-NoDerivs')),
    ]

LANGUAGE_CHOICES_DICT = dict(LANGUAGE_CHOICES)
AGE_CHOICES_DICT = dict(AGE_CHOICES)


# Create your models here.
class story(models.Model):
    def buildStoryDirname(self):
        return "s"+str(self.id);
    postersPath = 'posters'
    storiesPath = 'stories'
    title = models.CharField(_("Title"),max_length = 500)
    pub_date = models.DateTimeField(_('Date published'))
    language = models.CharField(_("Language"),max_length=10, choices=LANGUAGE_CHOICES)
    poster = models.ImageField(_("Poster"),blank=True,upload_to=postersPath, storage=customstorage.CustomStorage())
    abstract = models.TextField(_("Abstract"))
    age = models.CharField(_("Age"), max_length=15, choices=AGE_CHOICES)
    licensing = models.CharField(_("License"), max_length=60, choices=LICENSE_CHOICES, default="CC-BY")
    upvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='upvotes')
    downvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='downvotes')
    uploader = models.ForeignKey('accounts.User', null=True, blank=True, on_delete=models.SET_NULL)
    uploadReady = models.BooleanField(default=False)
    inUserLibrary = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='inUserLibrary')
    def score(self):
        return self.upvotes.all().count() - self.downvotes.all().count()
    def __str__(self):
        return self.title


