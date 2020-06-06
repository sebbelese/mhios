from django.core.files.storage import Storage
from storages.backends.dropbox import DropBoxStorage
from storages.utils import setting



#If content is None, the file is not uploaded, but just the name updated
class CustomStorage(DropBoxStorage):
    def save(self, name, content, max_length=None):
        if content is not None:
            return super().save(name, content, max_length)
        else:
            return name
    
        


