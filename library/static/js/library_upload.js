
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


function updateProgress(evt) 
{
   if (evt.lengthComputable) 
   {  // evt.loaded the bytes the browser received
      // evt.total the total bytes set by the header
       // jQuery UI progress bar to show the progress on screen
       var progress = (evt.loaded / evt.total) * 100;
       console.log("PROGRESS is",progress)
       $("#uploadstatus").css("width", progress+"%");
       $("#uploadstatus").attr("aria-valuenow", progress);
   } 
} 

function upload_story(file_data, storyId) {
    var csrftoken = $("[name=csrfmiddlewaretoken]").val();
    var xhrUp = new XMLHttpRequest();
    xhrUp.open("POST", 'uploadStory', true);
    xhrUp.setRequestHeader("X-CSRFToken", csrftoken);
    xhrUp.onreadystatechange = function() { //Appelle une fonction au changement d'état.
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	    console.log("UPLOAD OK")
	}
    }
    var form_data = new FormData();
    form_data.append('file', file_data);
    form_data.append('storyId', storyId);
    xhrUp.send(form_data);
    
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
    xhrAdd.open("POST", '#', false); //Synchronous as we want the picture to be uploaded before showing story
    xhrAdd.setRequestHeader("X-CSRFToken", csrftoken);

    xhrAdd.upload.onprogress = updateProgress;
    xhrAdd.onreadystatechange = function() { //Appelle une fonction au changement d'état.
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	    //The story file upload is made async after the story creation to allow the user to continue browsing (only download will be disabled)
	    data = JSON.parse(xhrAdd.responseText);
	    var file_data = $('#storyFile').prop('files')[0];
	    upload_story(file_data, data['storyId']);
	    window.location.replace("../"+data['storyId'])
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

    
    
    
