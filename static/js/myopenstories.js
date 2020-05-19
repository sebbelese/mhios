$(document).ready(function() {
    $('#set-language-submit-link').click(function(e){
	console.log("ee")
	e.preventDefault();
	$('#set-language-form').submit();
    });
});
