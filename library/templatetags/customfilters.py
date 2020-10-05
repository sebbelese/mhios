from django.template.defaulttags import register
from django.template.defaultfilters import stringfilter

from django.core.files.storage import default_storage as storage

#Used to access dictionnary value in the template by providing a variable as key
@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.filter
@stringfilter
def remote_url(str):
    return storage.url(str)

