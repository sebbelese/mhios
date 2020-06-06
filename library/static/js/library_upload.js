
var cropper;
function init_crop(elem) {
    if(cropper){
	cropper.destroy()
    }
    var reader = new FileReader();
    var file;
    if (elem.files && elem.files[0]){
	reader.readAsDataURL(elem.files[0]);
	reader.onload = function (e) {
	    $("#image").attr("src",e.target.result);
	    const image = document.getElementById('image');
	    if (typeof cropper !== 'undefined'){
		cropper.replace(e.target.result);
	    }else{
		cropper = new Cropper(image, {
		    autoCropArea : 1,
		    modal : false,
		    viewMode : 2,
		    background : false,
		    aspectRatio: 1 / 1,
		});
	    }

	}
    }
}

function update_progress(progress){
	$("#status").css("width", progress+"%");
	$("#status").attr("aria-valuenow", progress);
	$("#status").html(progress+'%');

}


/*function upload_chunk(form_data, file_data) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    form_data.append('file', file_data);
    $.ajax({
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
    })
}*/

if (window.Worker) {
    worker = new Worker(STATIC_PATH+"js/library_upload_worker.js");
    worker.addEventListener("message", updateProgressBar);   
} else {
    var uploader = document.createElement('script');
    uploader.src = STATIC_PATH+"js/library_upload_worker.js";
    document.getElementsByTagName("head")[0].appendChild(uploader);
}


function updateProgressBar(e) {
    
    var progress = e.data.value;
    $("#status").css("width", progress+"%");
    $("#status").attr("aria-valuenow", progress);
}
    

$( "#formUpload" ).submit(function( event ) {
    event.preventDefault();
    if(cropper){
	initCrop = cropper.getData();
	$("#id_x").val(initCrop.x);
	$("#id_y").val(initCrop.y);
	$("#id_height").val(initCrop.height);
	$("#id_width").val(initCrop.width);
	$("#id_rotation").val(initCrop.rotate);
    }
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();


    var xhrAdd = new XMLHttpRequest();
    xhrAdd.open("POST", '#', false);
    xhrAdd.setRequestHeader("X-CSRFToken", csrftoken);

    xhrAdd.onreadystatechange = function() { //Appelle une fonction au changement d'état.
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	    var file_data = $('#storyFile').prop('files')[0];
	    
	    // If workers are supported, create one by passing it the script url
	    if (window.Worker) {
		worker.postMessage({file_data : file_data, csrf_token : csrftoken, uploadstory_url : ADDSTORY_URL+'uploadStory' });

		var form_data = new FormData();
	    } else {
		var form_data = new FormData();
		upload_chunk(form_data, file_data, csrftoken, ADDSTORY_URL+'uploadStory');
	    }


	}else{
	    console.log("FAIL",this.response)
	}
    }
    xhrAdd.send(new FormData(document.querySelector("#formUpload")));// $( "#formUpload" ).serialize());
    

    /*this.submit();*/
});

$("#id_poster").change(function () {
    init_crop(this);
});


$(window).on('pageshow', function(){
    var inputElement = document.getElementById("id_poster");
    init_crop(inputElement)
});

    
    
    
