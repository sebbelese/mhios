
var soundInstance;
var storyMeta;
var nodeOnOK;
var indexOnOK;
var optionId;
var currentActionNode;
var storyIdx;
var atHome;
var allowHome = true;
var nodeOnHome = "";
var indexOnHome;
var allowPause;
var paused;

function init () {
    document.getElementById("btnGlobalLibrary").disabled = !isUserLibrary;
    document.getElementById("btnUserLibrary").disabled = isUserLibrary;
    if (soundInstance != null){
	soundInstance.stop();
    }
    soundInstance = null;
    storyMeta = null;
    nodeOnOK = "";
    document.getElementById("btnOK").disabled = true;
    indexOnOK = null;
    optionId = 0;
    currentActionNode = null;
    document.getElementById("btnLeft").disabled = false;
    document.getElementById("btnRight").disabled = false;
    if (storyIdStart >= 0){
	storyIdx = storyIdStart;
	storyIdStart = -1;
    }else{
	storyIdx = 0;
    }
    atHome = true;
    allowHome = false;
    document.getElementById("btnHome").disabled = !allowHome;
    nodeOnHome = "";
    indexOnHome = null;
    allowPause = false;
    document.getElementById("btnPause").disabled = !allowPause;
    paused = false;
}

function getUrl(path){
    return $.get('getFileUrl', {story_id: storiesId[storyIdx], filename : path}).then(function(data){
	var downloadUrl =  data['downloadUrl'];
	return downloadUrl;
    });
}

function playActionNode(){
    var choice;
    if (optionId == null){
	optionId = Math.floor(Math.random() * (currentActionNode.options.length + 1));
    }
    choice = optionId % currentActionNode.options.length;
    while (choice < 0) {
	choice += currentActionNode.options.length;
    }
    var nodeToRead = currentActionNode.options[choice];
    var nodes = storyMeta.stageNodes.filter( node => node.uuid == nodeToRead);
    if(nodes==undefined || nodes.length != 1){
	alert("ERROR: cannot find stage node "+nodeToRead);		
    }
    playStageNode(nodes[0]);
}

function onOk(){
    document.getElementById("btnGlobalLibrary").disabled = true;
    document.getElementById("btnUserLibrary").disabled = true;
    atHome = false;
    if (nodeOnOK != "") {
	var nodes = storyMeta.actionNodes.filter( node => node.id == nodeOnOK);
	if(nodes==undefined || nodes.length != 1){
	    alert("ERROR: cannot find action node "+nodeOnOK);		
	}
	currentActionNode = nodes[0];
	optionId = indexOnOK;
	playActionNode();
    }
}

function onHome() {
    if (allowHome){
	if (nodeOnHome == ""){
	    init();
	    startStory();
	}else{
	    var nodes = storyMeta.actionNodes.filter( node => node.id == nodeOnHome);
	    if(nodes==undefined || nodes.length != 1){
		alert("ERROR: cannot find action node "+nodeOnOK);		
	    }
	    currentActionNode = nodes[0];
	    optionId = indexOnHome;
	    playActionNode();
	}
    }
}

function playStageNode(node){
    allowHome = node.controlSettings.home;
    document.getElementById("btnHome").disabled = !allowHome;
    if (allowHome && node.homeTransition){
	nodeOnHome = node.homeTransition.actionNode;
	if (node.homeTransition.optionIndex < 0){
	    indexOnHome = null;
	}else{
	    indexOnHome = node.homeTransition.optionIndex;
	}
    }else{			
	nodeOnHome = "";
    }
    allowPause = node.controlSettings.pause;
    document.getElementById("btnPause").disabled = !allowPause;
    if (node.controlSettings.wheel == false){
	currentActionNode = null;
	document.getElementById("btnLeft").disabled = true;
	document.getElementById("btnRight").disabled = true;
    }else{
	document.getElementById("btnLeft").disabled = false;
	document.getElementById("btnRight").disabled = false;
    }

    document.getElementById("btnOK").disabled = !node.controlSettings.ok;
    if (node.controlSettings.ok || node.controlSettings.autoplay){
	nodeOnOK = node.okTransition.actionNode;
	if (node.okTransition.optionIndex < 0){
	    indexOnOK = null;
	}else{
	    indexOnOK = node.okTransition.optionIndex;
	}
    }else{			
	nodeOnOK = "";
    }
    if (node.image != null){
	getUrl("assets/"+node.image).then((imgUrl) => {
	    $("#nodeImage").attr("src", imgUrl);
	});
    }else{
	$("#nodeImage").attr("src", emptyBlackImage);
    }
    getUrl("assets/"+node.audio).then((audioUrl) => {
	if (soundInstance != null){
	    soundInstance.stop();
	}
	paused = false;
	soundInstance = new Howl({
	    src: audioUrl,
	    html5: true, //This is needed for streaming rather than downloading
	    format: node.audio.split('.').pop().toLowerCase(),
	    autoplay: true
	});
	soundInstance.on('end', function(){
	    if (node.controlSettings.autoplay){
		onOk();
	    }
	});
    });
}



function startStory(){
    
//    var metapromise = zip.file("story.json").async("string");

    getUrl("story.json").then((url) => {
	$.getJSON(url).then((story) => {
	    storyMeta = story;
	    var coverNodes = storyMeta.stageNodes.filter( node => node.squareOne == true);
	    if(coverNodes==undefined || coverNodes.length != 1){
		alert("ERROR: story should have a single cover node"+coverNodes);
		throw err; // or handle the error
	    }
	    var coverNode = coverNodes[0];
	    playStageNode(coverNode)
	}).catch( function(e) { 
	    alert("Error reading story: "+JSON.stringify(e));
	});
	
    });
}

function onLeft(){
    if (currentActionNode != null){
	optionId = optionId - 1;
	playActionNode();
    }
    if (atHome == true){
	storyIdx = storyIdx - 1;
	if (storyIdx < 0){
	    storyIdx = storyIdx + storiesId.length;
	}
	startStory();
    }
}

function onRight(){
    if (currentActionNode != null){
	optionId = optionId + 1;
	playActionNode();
    }
    if (atHome == true){
	storyIdx = (storyIdx + 1)%storiesId.length;
	startStory();
    }
}





function onPause() {
    if (allowPause && soundInstance != null){
	if (paused){
	    soundInstance.play();
	    paused = false;
	} else {
	    soundInstance.pause();
	    paused = true;

	}

    }
}


function switchLibrary(toUserLibrary){
    
    $.get('switchLibrary', {is_user_library: toUserLibrary}, function(data){
	isUserLibrary =  data.isUserLibrary
	storiesId = JSON.parse(data['storiesId']);
	allowHome = true;
	onHome();
    });
}

function onUserLibrary(){
    switchLibrary(true);
}

function onGlobalLibrary(){
    switchLibrary(false);
}

function toggleFullScreen() {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.getElementById ("wholeReader");
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

document.addEventListener('fullscreenchange', (event) => {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
    
    if (isInFullScreen) {
	document.getElementById("readerFirstRow").style.marginTop = "15px";
	document.getElementById("fromFullScreen").style.display = "inline";
	document.getElementById("toFullScreen").style.display = "none";
    } else {
	document.getElementById("fromFullScreen").style.display = "none";
	document.getElementById("toFullScreen").style.display = "inline";
    }
});

document.getElementById ("btnHome").addEventListener ("click", onHome);
document.getElementById ("btnOK").addEventListener ("click", onOk);
document.getElementById ("btnLeft").addEventListener ("click", onLeft);
document.getElementById ("btnRight").addEventListener ("click", onRight);
document.getElementById ("btnPause").addEventListener ("click", onPause);
document.getElementById ("btnUserLibrary").addEventListener ("click", onUserLibrary);
document.getElementById ("btnGlobalLibrary").addEventListener ("click", onGlobalLibrary);
document.getElementById ("btnFullScreen").addEventListener ("click", toggleFullScreen);



$(window).on('pageshow', onHome);
