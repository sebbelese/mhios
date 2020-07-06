
//const domContainer = document.querySelector('#reader_container');
//const e = React.createElement;

import "./unzipper.js";
import "./requestPack.js";
function playStory(){

    console.log(unzipper.Open.url)
    console.log(request)
    const directory = unzipper.Open.url(request,storyUrl);
    //console.log(directory.files);
    
    /*JSZipUtils.getBinaryContent(storyUrl, function (err, data) {
	if(err) {
	    console.log("ERROR: "+err);
	    throw err; // or handle the error
	}

	JSZip.loadAsync(data).then(function (zip) {
	    var metapromise = zip.file("story.json").async("string");
	    console.log(metapromise);
	    metapromise.then((meta) => {
		var story = JSON.parse(meta);
		console.log(story.stageNodes);
		var coverNodes = story.stageNodes.filter( node => node.type == "cover");
		if (coverNodes==undefined || coverNodes.length == 0){
		    coverNodes = story.stageNodes.filter( node => node.squareOne == true);
		}
		if(coverNodes==undefined || coverNodes.length != 1){
		    console.log("ERROR: story should have a single cover node"+coverNodes);
		    throw err; // or handle the error
		}
		var coverNode = coverNodes[0];
		console.log(coverNode);
		console.log(coverNode.audio)
		var audiopromise = zip.file("assets/"+coverNode.audio).async("blob");
		
		audiopromise.then((audio) => {
		    console.log(audio)
		    var audioUrl = URL.createObjectURL( audio );
		    var sound = new Howl({
			src: audioUrl,
			format: coverNode.audio.split('.').pop().toLowerCase(),
		    });
		    sound.play();
		    console.log("plaayed");
		});
		
	    });
	    
	});
    });*/
}

document.getElementById ("btnPlay").addEventListener ("click", playStory);



//IN HTML
//<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
//<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

//import  './studioEditorPackViewer.js';
//import  './studioreaderpack.js';
//import  './studioactions.js';

/*const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
  if (typeof value === "object" && value !== null) {
  if (seen.has(value)) {
  return;
  }
  seen.add(value);
  }
  return value;
  };
  };*/



/*var disp = actionLoadPackInEditor(data, "");
  console.log(disp);*/


/*readFromArchive(data)
  .then(loadedModel => {
  var a = studioActions;
  console.log(a);
  // Set loaded model in editor
  studioActions.setEditorDiagram(loadedModel);
  // Show editor
  studioActions.showEditor();
  studioActions.showViewer();
  })
  .catch(e => {
  console.error('failed to load story pack', e);
  });*/

/*
  readFromArchive(data).then(model => {
  console.log("success"+JSON.stringify(model, getCircularReplacer()));
  console.log("success2",model);
  //	model.viewer.options.translucent = 'translucent';
  //	model.viewer.options.overlay = false;
  //	model.viewer.options.autoplay = true;
  var viewer=new EditorPackViewer(model);
  //	console.log("viewer"+JSON.stringify(viewer, getCircularReplacer()));
  viewer.onOK
  ReactDOM.render(e(EditorPackViewer), domContainer);
  console.log("OK done")
  })
  .catch(e => {
  console.error('failed to load story pack', e);
  })
*/

