
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
    xhrAdd.open("POST", '#', true);
    xhrAdd.setRequestHeader("X-CSRFToken", csrftoken);

    xhrAdd.upload.onprogress = updateProgress;
    xhrAdd.onreadystatechange = function() { //Appelle une fonction au changement d'état.
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
	    //OK

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

    
    
    
