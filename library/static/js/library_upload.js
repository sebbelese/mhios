

var cropper;
var posterChanged;
var storyFileChosen;

var uploadInError;

function init_crop_with_file(file){
    var reader = new FileReader();
    reader.readAsDataURL(file);
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

function init_crop(elem) {
    if(cropper){
	cropper.destroy()
    }
    if (elem.files && elem.files[0]){
	init_crop_with_file(elem.files[0]);
    }
}

$("#id_poster").change(function () {
    jQuery('#id_thumbnailFromZip').val("");
    init_crop(this);
    posterChanged = true;
});


$(window).on('pageshow', function(){
    var inputElement = document.getElementById("id_poster");
    //Update existing story
    if (typeof old_poster !== 'undefined') {
	if (old_poster == "assets/defaultPoster.jpg"){
	    posterChanged = false;
	}else{
	    posterChanged = true;
	}
    }
    //Upload new story
    else{
	posterChanged = false;
    }
    init_crop(inputElement)
    storyFileChosen = false;
});


//Loads poster from zip file to replace default image
function load_poster_from_zip(elem) {
    var file;
    if (elem.files && elem.files[0]){

	var zip = new JSZip();
	zip.loadAsync( elem.files[0] ).then(function(zip) {
	    if (zip.files["thumbnail.png"]){
		zip.file("thumbnail.png").async("base64").then((thumb_b64) => {
		    zip.file("thumbnail.png").async("blob").then((thumb_blob) => {
			init_crop_with_file(thumb_blob);
			jQuery('#id_thumbnailFromZip').val(thumb_b64);
		    });
		});
	    }
	}).catch(function(err) {
	    alert("ERROR: story should be a zip file");
	    return;
	});	
    }
}

$("#storyFile").change(function () {
    //If the user already uploaded a poster, we do not load from zip
    //Otherwise we load poster from zip file (if exists) to replace default image
    if (!posterChanged){
	load_poster_from_zip(this);
    }
    spanElem = document.getElementById("noFileUpdate")
    if(typeof(spanElem) != 'undefined' && spanElem != null){
	spanElem.style.display= 'none';
    }
    storyFileChosen = true;
    document.getElementById("licensing").classList.remove("hiddenField");
});




//Uploading and creating story

var totalPerFile;
var loadedPerFile;
var totalSize;
var nbFilesInZip;
var nbRetriesUpload=10;
var nbRetriesGetUploadLink = 20;

function updateProgress(uploadUrl, evt) 
{
    if (evt.lengthComputable) 
    {
	// evt.loaded the bytes the browser received
	loadedPerFile[uploadUrl] = evt.loaded;

	if (nbFilesInZip >= 0){
	    if (Object.keys(totalPerFile).length == nbFilesInZip){
		totalSize = 0;
		Object.keys(totalPerFile).forEach(function(key) {
		    totalSize += totalPerFile[key];
		});
		nbFilesInZip = -1;
	    }
	}
	loaded = 0;
	Object.keys(loadedPerFile).forEach(function(key) {
	    loaded += loadedPerFile[key];
	});
	var progress = (loaded / totalSize) * 100;
	$("#uploadStatus").css("width", progress+"%");
	$("#uploadStatus").attr("aria-valuenow", progress);
    } 
} 

function upload_story(file_data, storyId, uploadUrl, nbRetries) {
    return new Promise((resolve, reject) => {
	if (uploadInError == false){
	    var xhrUp = new XMLHttpRequest();
	    xhrUp.open("POST", uploadUrl, true);
	    xhrUp.upload.addEventListener("progress", updateProgress.bind(null, uploadUrl), false);
	    xhrUp.setRequestHeader("Content-Type", 'application/octet-stream');
	    xhrUp.onreadystatechange = function() { //Call when state change
		if (this.readyState === XMLHttpRequest.DONE){
		    if (this.status === 200) {
			resolve("Uploaded successfully");
		    }else{
			if (nbRetries > 0){
			    console.log("Fail: retry ");
			    console.log(nbRetries-1);
			    upload_story(file_data, storyId, uploadUrl, nbRetries-1).then((value) => {
				resolve(value);
			    }).catch((value) => {
				reject(value);
			    });
			}else{
			    reject("Could not upload file. Status "+this.status);
			}
		    }
		}
	    }
	    xhrUp.send(file_data);
	}else{
	    reject("Some uploads failed");
	}
    });
    
}

function getLinkUploadFile(zip, storyId, file){
    return $.get('../uploadStoryFile', {story_id: storyId, filename : file}).then(function(data){
	//Unzip
	return zip.files[file].async('blob').then(function (fileData) {
	    if (fileData.size > 0){
		var uploadUrl =  data['uploadUrl'];
		totalPerFile[uploadUrl] = fileData.size;
		//UPLOAD HERE
		return upload_story(fileData, storyId, uploadUrl, nbRetriesUpload);
	    }
	});
    });
}

$( "#formUpload" ).submit(function( event ) {
    uploadInError = false;
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
    
    xhrAdd.onreadystatechange = function() {
	//When the server has answered (story was created on server, but not uploaded)
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

	    //The user has set a story file to upload
	    if (storyFileChosen){
		storyId = JSON.parse(xhrAdd.responseText)['storyId'];
		
		$.get('../deleteStoryPath', {story_id: storyId}).then(function(data){

		
		    var files_data = $('#storyFile').prop('files')[0];
		    if (files_data == undefined){
			alert("ERROR: story zip file not provided");
			return;
		    }
		    // if (files_data.type == "application/zip"){
		    totalPerFile = {};
		    loadedPerFile = {};
		    totalSize = files_data.size;
		    
		    
		    var zip = new JSZip();
		    zip.loadAsync( files_data )
			.then(function(zip) {
			    
			    if (!zip.files["story.json"]){
				alert("ERROR: zip file is not a valid story file");
				return;
			    }
			    
			    nbFilesInZip = Object.keys(zip.files).length;
			    
			    $("#id_initDone").val(false); //Story is initialized along with the first zip upload. We don't want to do it twice
			    promises = [];//This is a list of promises to know when all files are done uploading
			    //Loop in files in zip
			    zip.forEach(function(file){
				if (file.toLowerCase() != "license.txt") {
				    promise = getLinkUploadFile(zip, storyId, file);
				    for(var iRetry=0; iRetry<nbRetriesGetUploadLink; iRetry++) {
					promise = promise.catch(function(err) {
					    console.log("When uploading",file);
					    console.log("Server error, probably Heroku timeout. Retry",iRetry,"over",nbRetriesGetUploadLink);
					    return getLinkUploadFile(zip, storyId, file);
					});
				    }
				    promises.push(promise)
				}
			    });
			    //We update the license file
			    promises.push($.get('../uploadStoryFile', {story_id: storyId, filename : "LICENSE.txt"}).then(function(dataLic){
				licText = JSON.parse(xhrAdd.responseText)['license'];
				var licBlob = new Blob([licText], {
				    type: 'text/plain'
				});
				var uploadUrl =  dataLic['uploadUrl'];
				totalPerFile[uploadUrl] = licBlob.size;
				return upload_story(licBlob, storyId, uploadUrl, nbRetriesUpload);
			    }));
			    
			    
			    Promise.all(promises).then((value)=>{//Wait for all the files are uploaded
				$.get('../uploadStoryFile', {story_id: storyId, filename : "LICENSE.txt"}).then(function(dataLic){
				    licText = JSON.parse(xhrAdd.responseText)['license'];
				    var licBlob = new Blob([licText], {
					type: 'text/plain'
				    });
				    var uploadUrl =  dataLic['uploadUrl'];
				    totalPerFile[uploadUrl] = licBlob.size;
				    return upload_story(licBlob, storyId, uploadUrl, nbRetriesUpload);
				}).then((value)=>{				
				    $.get('../uploadStoryDone', {story_id: storyId}).then(function(){
					window.location.replace("../");	    
				    })
				});
			    }).catch(function(err) {
				uploadInError = true;
				console.log("err.stack")
				alert("ERROR: cannot create story: "+err.message);
				return;
			    });
			}).catch(function(err) {
			    alert("ERROR: story should be a zip file");
			    return;
			});
		});
	    }else{
		//If no file update has bee done, the changes are saved and we can go back to library
		window.location.replace("../");
	    }
	}
    }
    
    xhrAdd.send(new FormData(document.querySelector("#formUpload")));
    
    //}else{
    //	alert("ERROR: story should be a zip file");
//	return;
  //  }
});





/*this.submit();*/





