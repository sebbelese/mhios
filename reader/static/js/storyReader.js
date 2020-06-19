
//import readFromArchive from './studio-javascript/src/utils/readerpack.js'

JSZipUtils.getBinaryContent(storyUrl, function (err, data) {
    if(err) {
	console.log("ERROR: "+err);
      throw err; // or handle the error
    }
    var model = readFromArchive(data);
    console.log("success"+model)
    /*JSZip.loadAsync(data).then(function (zip) {
        // ...
	f = zip.file("story.json").async("string");
	console.log(f.file("story.json"));
    });*/
});




