from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager

class User(AbstractUser):
    email = models.EmailField(_('Email'), unique=True)
    is_active = models.BooleanField(_('Is active'), default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def get_nickname(self):
        return self.username
    
    def __str__(self):
        return self.email
    
