$(document).ready(function() {
    $('.toUserLib').click(function(){
	var storyid;
	storyid = $(this).attr("data-storyid");
	$.get('toUserLibrary', {story_id: storyid}, function(data){
	    if (data.added){
		$("#toUserLib"+storyid).addClass("selected");
	    }else{
		$("#toUserLib"+storyid).removeClass("selected");
	    }
	});
    });
});
