from django.core.files.storage import Storage
from storages.backends.dropbox import DropBoxStorage
from storages.utils import setting

from dropbox.files import (
    CommitInfo, WriteMode
)

_DEFAULT_MODE = 'add'


#If content is None, the file is not uploaded, but just the name updated
class CustomStorage(DropBoxStorage):
    write_mode = setting('DROPBOX_WRITE_MODE', _DEFAULT_MODE)
    def save(self, name, content, max_length=None):
        if content is not None:
            return super().save(name, content, max_length)
        else:
            return name

    def getUploadLink(self, name, max_length=None):
        """
        Create a dropbox upload link for the file specified by name. 
        """
        name = self.get_available_name(name, max_length=max_length)
        return [name, self._getUploadLink(name)]

        
    def _getUploadLink(self, name):
        commit = CommitInfo(path=self._full_path(name), mode=WriteMode(self.write_mode))
        return self.client.files_get_temporary_upload_link(commit_info=commit)
        

        


