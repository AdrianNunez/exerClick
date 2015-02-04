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
		
		$.ajax({
			type: 'GET',
			url: 'http://exerclick-api.net46.net/show-exercises.php',
			async: false,
			jsonpCallback: 'jsonCallback',
			contentType: "application/json",
			dataType: 'jsonp',
			data: { Type: 'Active' },
			success: function(data) {
				$('#exercises-content').html("");
				$.each(data.exercises, function(i, item) {
					$('#exercises-content').append(
					'<div class="exercise exercise-active" data-id="' + item.exercise.id + '">' +
						'<div class="exercise-container col-xs-12">' +
							'<div class="col-xs-4 col-sm-6 col-md-9 col-lg-9 exercise-name">' +
								'<div class="ellipsis padd1 bold">' + item.exercise.description + '</div>' +
								'<div class="exercise-name-icons padd3">5/78 <i class="fa fa-check-square-o fa-fw"></i> 52/78 <i class="fa fa-exclamation fa-fw"></i></div>' +
							'</div>' +
							'<div class="col-xs-8 col-sm-6 col-md-3 col-lg-3 exercise-buttons">' +
								'<div class="exercise-buttons-icons"><div align="right">' +
									'<button class="btn btn-default btn-primary col-xs-offset-1 col-xs-3"><i class="fa fa-flag"></i></button>' +
									'<button class="btn btn-default btn-warning col-xs-offset-1 col-xs-3"><i class="fa fa-exclamation-triangle statistics-button"></i></button>' +
									'<button class="btn btn-default btn-success col-xs-offset-1 col-xs-3"><i class="fa fa-bar-chart statistics-button"></i></button>' +
								'</div></div>' +
							'</div>' +
						'</div>' +
					'</div>'
					);
				});
			}
		});
		
		$(window).on('resize', function() {
			$('#header').show();
			var offsetTop = $('#main').offset().top;
			var offsetBottom =  $('#footer').height();
			var windowHeight = $(window).height();
			// DYNAMIC RESIZINGS
			$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - 2*Math.floor(parseFloat($('body').css('font-size'))));
			$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
		});
	});
});

