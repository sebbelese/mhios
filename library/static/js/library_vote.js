$(document).ready(function() {
    $('.vote').click(function(){
	var storyid;
	storyid = $(this).attr("data-storyid");
	vote = $(this).attr("data-vote");
	$.get('voteStory', {story_id: storyid, vote : vote}, function(data){
	    $('#scoreStory'+storyid).html(data.score);
	    if (data.isButtonUp){
		$('#upvoteStory'+storyid).css("background-color", "green");
	    }else{
		$('#upvoteStory'+storyid).css("background-color", "blue");
	    }
	    if (data.isButtonDown){
		$('#downvoteStory'+storyid).css("background-color", "green");
	    }else{
		$('#downvoteStory'+storyid).css("background-color", "blue");
	    }
	});
    });
});
