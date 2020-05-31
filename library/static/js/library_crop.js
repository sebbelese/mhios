
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

$( "#formUpload" ).submit(function( event ) {
    if(cropper){
	initCrop = cropper.getData();
	$("#id_x").val(initCrop.x);
	$("#id_y").val(initCrop.y);
	$("#id_height").val(initCrop.height);
	$("#id_width").val(initCrop.width);
	$("#id_rotation").val(initCrop.rotate);
    }
});

$("#id_poster").change(function () {
    init_crop(this);
});


$(window).on('pageshow', function(){
    var inputElement = document.getElementById("id_poster");
    init_crop(inputElement)
});

    
    
    
