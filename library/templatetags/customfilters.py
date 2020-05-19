from django.template.defaulttags import register

#Used to access dictionnary value in the template by providing a variable as key
@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)
