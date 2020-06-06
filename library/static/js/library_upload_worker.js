// When this worker receives a message
self.addEventListener("message", onMessageReceive);

function onMessageReceive(e) {
    var form_data = new FormData();
    /*    form_data = e.data.form_data;*/
    csrf_token = e.data.csrf_token;
    file_data = e.data.file_data;
    upload_url = e.data.uploadstory_url;
    upload_chunk(form_data, file_data, csrf_token, upload_url);
}

function upload_chunk(form_data, file_data, csrf_token, upload_url) {
    form_data.append('file', file_data);

    var xhrUp = new XMLHttpRequest();
    xhrUp.open("POST", upload_url, false);
    xhrUp.setRequestHeader("X-CSRFToken", csrf_token);

    xhrUp.onreadystatechange = function() { //Appelle une fonction au changement d'état.
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	    data = JSON.parse(xhrUp.responseText);

	    if (typeof document == 'undefined') {//We are in a worker
		self.postMessage({ type: "progress", value: data["progress"] });
	    }else{
		progress = data["progress"];
		$("#status").css("width", progress+"%");
		$("#status").attr("aria-valuenow", progress);
	    }
	    
	    if (!data["finishedUpload"]){
		var form_data = new FormData();
		form_data.append('savedFilename', data["savedFilename"]);
		form_data.append('sessionId', data["sessionId"]);
		form_data.append('offset', data["offset"]);
		upload_chunk(form_data, file_data, csrf_token, upload_url);
	    }
	}else{
	    console.log("FAIL",this.response)
	}
    }

    xhrUp.send(form_data);
    
/*    $.ajax({
	url: 'uploadStory', 
	type: 'POST',
	data: form_data, 
	headers:{"X-CSRFToken": csrftoken},
	cache: false,
	processData: false,
	contentType: false,
	async: false,
	enctype: 'multipart/form-data',
	success: function (data) {
	    console.log(data.progress)
	    $("#status").css("width", data.progress+"%");
	    $("#status").attr("aria-valuenow", data.progress);
	    $("#status").html(data.progress+'%');
	    if (!data.finishedUpload){
		var form_data = new FormData();
		form_data.append('savedFilename', data.savedFilename);
		form_data.append('sessionId', data.sessionId);
		form_data.append('offset', data.offset);
		console.log("pr "+file_data)
		upload_chunk(form_data, file_data);
	    }
	}
    })*/
}
