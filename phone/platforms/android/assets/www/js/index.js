$(document).on('ready', function() {
	$(window).on('load', function() {	
		
	});
});

domain = 'https://galan.ehu.eus/exerclick/';

function doLogin() {
	username = $('#username').val();
	password = $('#password').val();
	$.ajax({
		type: 'GET',
		async: false,
		url: domain + 'login.php',
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		data: { Username: $('#username').val(), Password: $('#password').val() },
		success: function(data) {	
			if(data.next == null) {
				alert('No tienes clase');
			} else {
				window.location.replace(data.next);
			}
		}
	});
}