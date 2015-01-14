$(document).on('ready', function() {
	$(window).on('load', function() {
	});
});

function doLogin() {
	var username = $('#username').val();
	var password = $('#password').val();
	if(username == 'adrian') {
		window.location.replace('student.html');
	} else {
		window.location.replace('teacher.html');
	}
	return false;
}