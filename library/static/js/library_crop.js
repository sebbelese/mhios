$(function () {
    
    /* SCRIPT TO SHOW THE PICTURE WHEN UPLOADED */
    $("#id_poster").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
	    var file;
            reader.onload = function (e) {
		$("#image").attr("src",e.target.result);
		const image = document.getElementById('image');
		const cropper = new Cropper(image, {
		    aspectRatio: 1 / 1,
		    crop(event) {
			$("#id_x").val(event.detail.x);
			$("#id_y").val(event.detail.y);
			$("#id_height").val(event.detail.height);
			$("#id_width").val(event.detail.width);
		    },
		});
            }
	    reader.readAsDataURL(this.files[0]);
        }
	

    });
  
});
  
    /* SCRIPTS TO HANDLE THE CROPPER BOX 
    var $image = $("#image");
    var cropBoxData;
    var canvasData;
    $("#modalCrop").on("shown.bs.modal", function () {
        $image.cropper({
            viewMode: 1,
            aspectRatio: 1/1,
            ready: function () {
		$image.cropper("setCanvasData", canvasData);
		$image.cropper("setCropBoxData", cropBoxData);
            }
        });
    }).on("hidden.bs.modal", function (e) {
        cropBoxData = $image.cropper("getCropBoxData");
        canvasData = $image.cropper("getCanvasData");
        $image.cropper("destroy");
    });
    
    SCRIPT TO COLLECT THE DATA AND POST TO THE SERVER 
    $(".js-crop").click(function () {
        var cropData = $image.cropper("getData");
        $("#id_x").val(cropData["x"]);
        $("#id_y").val(cropData["y"]);
        $("#id_height").val(cropData["height"]);
        $("#id_width").val(cropData["width"]);

    });*/
    
