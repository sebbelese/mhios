$(document).ready(function() {
    $("#uploadButton").click(function() {
        var formData = new FormData($('#formUpload')[0]);
        console.log(formData);
        $.ajax({
            url: "/library",
            type: 'POST',
            data: formData,
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
			console.log(evt.loaded);
			console.log(evt.total);
                        console.log(percentComplete);
                        $('#status').html('<b> Uploading -> ' + (Math.round(percentComplete * 100)) + '% </b>');
                    }
                }, false);
                return xhr;
            },
            success: function(data) {
                $("#status").html('UPLOADED!!');
            },
            cache: false,
            contentType: false,
            processData: false
        });
        return false;
    });
});
