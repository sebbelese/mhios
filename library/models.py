from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.translation import get_language
from django.conf import settings


LANGUAGE_CHOICES= [
    ('fr', _('French')),
    ('en', _('English')),
    ('es', _('Spanish'))
    ]

AGE_CHOICES = [
    ('3to4',_('3 to 4 y/o')),
    ('5to7',_('5 to 7 y/o')),
    ('7to9',_('7 to 9 y/o')),
    ('10to99',_('10 y/o and +'))
    ]

LANGUAGE_CHOICES_DICT = dict(LANGUAGE_CHOICES)
AGE_CHOICES_DICT = dict(AGE_CHOICES) 

# Create your models here.
class story(models.Model):
    title = models.CharField(_("Title"),max_length = 500)
    pub_date = models.DateTimeField(_('Date published'))
    language = models.CharField(_("Language"),max_length=10, choices=LANGUAGE_CHOICES)
    poster = models.ImageField(_("Poster"),default='posters/default.png',upload_to='posters')
    storyFile = models.FileField(_("Story"),upload_to='stories')
    abstract = models.TextField(_("Abstract"))
    age = models.CharField(_("Age"), max_length=15, choices=AGE_CHOICES)
    upvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='upvotes')
    downvotes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='downvotes')
    def score(self):
        return self.upvotes.all().count() - self.downvotes.all().count()
    def __str__(self):
        return self.title

    
