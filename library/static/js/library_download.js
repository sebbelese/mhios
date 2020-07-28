var downloadInError;


$(document).ready(function() {
    $('.downloadLink').click(function(){
        var storyid;
        storyid = $(this).attr("data-storyid");
        $.get('getStoryFilesListAndSize', {story_id: storyid}).then(function(dataFile){
	    var zip = new JSZip();
	    var count = 0;
	    var totalSize = 0;
	    for (var iF = 0; iF < dataFile.filesListAndSize.length; iF++) {
		totalSize += dataFile.filesListAndSize[iF][1];
	    }
	    for (var iF = 0; iF < dataFile.filesListAndSize.length; iF++) {
		$.get('getStoryFileLink', {path: dataFile.filesListAndSize[iF][0],story_id: storyid}).then(function(dataLink){
		    return JSZipUtils.getBinaryContent(dataLink.link, function (err, data) {
			if(err) {
			    alert("Error downloading story file: "+err.message)
			    throw err; // or handle the error
			}
			console.log(dataLink.inPath);
			zip.file(dataLink.inPath, data, {binary:true});
			count++;
			if (count == dataFile.filesListAndSize.length){
			    zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
				saveAs(blob, storyid+".zip");                          // 2) trigger the download
			    }, function (err) {
				alert("Error generating zip file: "+err.message)
				throw err; // or handle the error
			    });
			}
		    });
		    
		});
	    }
        });
    });
});




