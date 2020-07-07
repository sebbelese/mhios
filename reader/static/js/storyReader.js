
function getUrl(storyid, path){
    return $.get('getFileUrl', {story_id: storyid, filename : path}).then(function(data){
	var downloadUrl =  data['downloadUrl'];
	console.log("upurl"+downloadUrl);
	return downloadUrl;
    });
}

function playStory(){
//    var metapromise = zip.file("story.json").async("string");

    getUrl(story_Id, "story.json").then((url) => {
	console.log("url is"+url)

	jQuery.getJSON(url).fail(function(jqXHR, status, error){
	    console.log("other error: "+status + " "+error)
		//some other error
	});
	$.getJSON(url).then((story) => {
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
	    //console.log(coverNode);
	    //console.log(coverNode.audio)
	    //var audiopromise = zip.file("assets/"+coverNode.audio).async("blob");

	    getUrl(story_Id, "assets/"+coverNode.audio).then((audioUrl) => {
		var sound = new Howl({
		    src: audioUrl,
		    format: coverNode.audio.split('.').pop().toLowerCase(),
		});
		sound.play();
		console.log("played");
	    });
	}).catch( function(e) { 
	    alert("Error reading story: "+JSON.stringify(e));
	});
	
    });
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

