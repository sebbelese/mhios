from django.core.files.storage import Storage
from storages.backends.dropbox import DropBoxStorage
from storages.utils import setting

_DEFAULT_MODE = 'add'

from dropbox.files import (
    CommitInfo, UploadSessionCursor, WriteMode
)

#If content is None, the file is not uploaded, but just the name updated
class CustomStorage(DropBoxStorage):
    write_mode = setting('DROPBOX_WRITE_MODE', _DEFAULT_MODE)

    def __init__(self):
        super().__init__()
        self.CHUNK_SIZE = 1 * 1024 * 1024
        
    def save(self, name, content, max_length=None):
        if content is not None:
            return super().save(name, content, max_length)
        else:
            return name

    def saveFirstChunk(self, name, content, max_length=None):
        if content is not None:
            """
            Save new content to the file specified by name. The content should be
            a proper File object or any Python file-like object, ready to be read
            from the beginning.
            """
            # Get the proper name for the file, as it will actually be saved.
            if name is None:
                name = content.name
            
            if not hasattr(content, 'chunks'):
                content = File(content, name)
            
            name = self.get_available_name(name, max_length=max_length)

            return self._save_first_chunk(name, content)
        else:
            return (name, None)

    def _save_first_chunk(self, name, content):
        content.open()
        if content.size <= self.CHUNK_SIZE:
            self.client.files_upload(content.read(), self._full_path(name), mode=WriteMode(self.write_mode))
            content.close()
            return (name, None)
        else:
            sessionId =  self._init_chunked_upload(content)
            return (name, sessionId)

    def saveNextChunk(self, content, sessionId, name):
        print("DONSE IS ",content.tell())
        if content.tell() < content.size:
            self._save_chunk(content, sessionId, self._full_path(name))
            return False
        else:
            print("DONE")
            return True

    def getChunkProgress(self, content):
        if content.closed:
            return 100
        else:
            return  100.*(content.tell()/content.size)

        
    def _save_chunk(self, content, sessionId, dest_path):
        print("saving chunk, progress",self.getChunkProgress(content))
        cursor = UploadSessionCursor(sessionId, content.tell())
        if (content.size - content.tell()) <= self.CHUNK_SIZE:
            commit = CommitInfo(path=dest_path, mode=WriteMode(self.write_mode))
            self.client.files_upload_session_finish(
                content.read(self.CHUNK_SIZE), cursor, commit
            )
        else:
            self.client.files_upload_session_append_v2(
                content.read(self.CHUNK_SIZE), cursor
            )


    def _init_chunked_upload(self, content):
        upload_session = self.client.files_upload_session_start(
            content.read(self.CHUNK_SIZE)
        )
        return upload_session.session_id
    
    def _chunked_upload(self, content, dest_path):
        sessionId = self._init_chunked_upload(content)

        while content.tell() < content.size:
            self._save_chunk(content, sessionId, dest_path)
    
        


