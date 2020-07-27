var downloadInError;


$(document).ready(function() {
    $('.downloadLink').click(function(){
        var storyid;
        storyid = $(this).attr("data-storyid");
        $.get('getStoryFilesList', {story_id: storyid}, function(data){
        }
    });
});




