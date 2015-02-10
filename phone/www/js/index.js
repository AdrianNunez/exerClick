$(document).on('ready', function() {
	$(window).on('load', function() {	
		
	});
});

function doLogin() {
	username = $('#username').val();
	password = $('#password').val();
	$.ajax({
		type: 'GET',
		async: false,
		url: 'http://exerclick-api.net46.net/login.php',
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		data: { Username: $('#username').val(), Password: $('#password').val() },
		success: function(data) {		
			window.location.replace(data.next);
		}
	});
}