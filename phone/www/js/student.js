$(document).on('ready', function() {
	$(window).on('load', function() {
		// Needed to get all the height
		$('#header').show();
		
		var windowHeight = $(window).height();
		var offsetTop = $('#main').offset().top;
		var offsetBottom =  $('#footer').height();
		var windowHeight = $(window).height();
		
		// DYNAMIC RESIZINGS
		$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - 2*Math.floor(parseFloat($('body').css('font-size'))));
		$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
		$('#exercises-content').load('activesS.html');
		
		$(window).on('resize', function() {
			$('#header').show();
			$('#state-buttons').show();
			var offsetTop = $('#main').offset().top;
			var offsetBottom =  $('#footer').height();
			var windowHeight = $(window).height();
			// DYNAMIC RESIZINGS
			$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
			$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
			setTimeout(function () { myScroll.refresh() }, 0); 
			
			$('.darken').css('height', windowHeight);
			$('.darken').css('bottom', windowHeight - $('#overfooter').offset().top);
			$('#new-exercise').css('bottom', offsetBottom);
		});
	});
});

