$(document).on('ready', function() {
	$(window).on('load', function() {
		$('#header').show();
		var windowHeight = $(window).height();
		var offsetTop = $('#main').offset().top;
		
		$('#main').css('height', windowHeight - offsetTop);
		$('#main').css('bottom', Math.floor(parseFloat($('body').css('font-size'))));
		$('#main-content').css('height', windowHeight - offsetTop - Math.floor(parseFloat($('body').css('font-size'))));
		
		$(window).on('resize', function() {
			$('#header').show();
			var windowHeight = $(window).height();
			var offsetTop = $('#main').offset().top;
			
			$('#main').css('height', windowHeight - offsetTop);
			$('#main').css('bottom', Math.floor(parseFloat($('body').css('font-size'))));
			$('#main-content').css('height', windowHeight - offsetTop - Math.floor(parseFloat($('body').css('font-size'))));
		});
	});
});

