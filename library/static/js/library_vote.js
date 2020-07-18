$(document).ready(function() {
    $('.vote').click(function(){
	var storyid;
	storyid = $(this).attr("data-storyid");
	vote = $(this).attr("data-vote");
	$.get('voteStory', {story_id: storyid, vote : vote}, function(data){
	    $('#scoreStory'+storyid).html(data.score);
	    if (data.isButtonUp){
		$('#upvoteStory'+storyid).addClass("selected");
	    }else{
		$('#upvoteStory'+storyid).removeClass("selected");
	    }
	    if (data.isButtonDown){
		$('#downvoteStory'+storyid).addClass("selected");
	    }else{
		$('#downvoteStory'+storyid).removeClass("selected");
	    }
	});
    });
});
