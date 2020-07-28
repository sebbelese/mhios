$(document).ready(function() {
    $('.downloadLink').click(function(){
        var storyid;
        storyid = $(this).attr("data-storyid");
	document.getElementById("downloadStatusDiv"+storyid).hidden = false;
        $.get('getStoryFilesListAndSize', {story_id: storyid}).then(function(dataFile){
	    var zip = new JSZip();
	    var nbFilesAdded = 0;
	    var loadedPerFile = {};
	    var totalSize;
	    var nbFilesInZip;
	    var totalSize = 0;
	    for (var iF = 0; iF < dataFile.filesListAndSize.length; iF++) {
		totalSize += dataFile.filesListAndSize[iF][1];
	    }
	    for (var iF = 0; iF < dataFile.filesListAndSize.length; iF++) {
		$.get('getStoryFileLink', {path: dataFile.filesListAndSize[iF][0], story_id: storyid}).then(function(dataLink){
		    return JSZipUtils.getBinaryContent(dataLink.link, {
			progress (evt){
			    if (evt.originalEvent.lengthComputable) 
			    {
				// evt.loaded the bytes the browser received
				loadedPerFile[evt.path] = evt.loaded;
				loaded = 0;
				Object.keys(loadedPerFile).forEach(function(key) {
				    loaded += loadedPerFile[key];
				});
				var progress = (loaded / totalSize) * 70; //We leave 30% for the zipping
				$("#downloadStatus"+storyid).css("width", progress+"%");
				$("#downloadStatus"+storyid).attr("aria-valuenow", progress);
			    } 
			}
		    }).then(function(data) {
			zip.file(dataLink.inPath, data, {binary:true});
			nbFilesAdded++;
			if (nbFilesAdded == dataFile.filesListAndSize.length){
			    zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
				progress = 70.0 + metadata.percent*0.3;
				$("#downloadStatus"+storyid).css("width", progress+"%");
				$("#downloadStatus"+storyid).attr("aria-valuenow", progress);
			    }).then(function (blob) { // 1) generate the zip file
				saveAs(blob, storyid+".zip");                          // 2) trigger the download
			    }, function (err) {
				alert("Error generating zip file: "+err.message)
				throw err; // or handle the error
			    });
			}
		    },function(err){
			alert("Error downloading story file: "+err.message)
			throw err; // or handle the error
		    });
		    
		});
	    }
        });
    });
});




