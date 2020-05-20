
var cropper;
function init_crop(elem) {
    if(cropper){
	cropper.destroy()
	console.log("destroyine")
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
		    crop(event) {
			$("#id_x").val(event.detail.x);
			$("#id_y").val(event.detail.y);
			$("#id_height").val(event.detail.height);
			$("#id_width").val(event.detail.width);
			$("#id_rotation").val(event.detail.rotate);
		    },
		});
	    }
	}
    }
}


$("#id_poster").change(function () {
    init_crop(this);
});


window.onload = function(){
    var inputElement = document.getElementById("id_poster");
    init_crop(inputElement)
};
    
    
    
