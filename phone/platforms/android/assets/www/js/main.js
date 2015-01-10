$(document).on('ready', function() {
	$(window).on('load', function() {
		// Needed to get all the height
		$('#header').show();
		$('#state-buttons').show();
		
		var windowHeight = $(window).height();
		var offsetTop = $('#main').offset().top;
		var offsetBottom =  $('#overfooter').height() + $('#footer').height();
		var windowHeight = $(window).height();
		
		// DYNAMIC RESIZINGS
		$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
		$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
		//$('#exercises-container').css('top', $('#state-buttons').offset().top + $('#header').height());
		//$('#exercises-container').css('width', $('#state-buttons').width());
		//$('#exercises-content').css('width', $('#state-buttons').width());
		$('#exercises-content').load('actives.html');
		
		// Add the dark div
		$('#container').append('<div class="darken"></div>');
		$('.darken').css('height', windowHeight);
		
		// Add the new-exercise div
		$('#container').append(
			'<div id="new-exercise">' +
				'<div>' +
					'<div class="new-exercise-title col-xs-3"><i id="new-exercise-atras" class="fa fa-reply btn btn-default"></i></div>' +
					'<div class="new-exercise-title col-xs-6" align="center"><h4>NUEVO EJERCICIO</h4></div>' +
					'<div class="new-exercise-title col-xs-3"><i class="fa fa-paper-plane pull-right btn ui-corner-all ui-btn-b btn-warning"></i></div>' + 
				'</div>' +
				'<div class="clear"></div>' +
				'<div class="row separator"></div>' +
				'<form class="campos"> ' +
					'<div class="col-xs-12"><input type="text" class="form-control" placeholder="Identificador del nuevo ejercicio (número de ejercicio, nombre, etc.)"></div>' +
					'<div class="clear"></div>' +
				'</form>' +
			'</div>'
		);
		$('#new-exercise').addClass('top-shadow');
	
		// Add click listeners
		$('#overfooter').on('click', newExercise);
		$('.darken').on('click', newExercise);
		
		$('#new-exercise').css('bottom', offsetBottom);
		
		// Occult both divs
		$('#new-exercise').hide();
		$('.darken').hide();
		
		/*var myScroll = new IScroll('#exercises-container', {
			mouseWheel: true,
			scrollbars: false,
			scrollX: false,
			bounceLock: true,
			snap: true,
			hScroll: false,
			hScrollbar: false,
			lockDirection: true,
			desktopCompatibility: true
		});
		myScroll.on('scrollEnd', function() {
			$('#subheader').css('border', '1px solid red');
		});*/
			
		function newExercise() {
			if($('#new-exercise').is(':hidden')) {
				$('#overfooter').off('click');
				$('.darken').show();
				$('#new-exercise').slideDown("slow", function() {
					$('#overfooter').on('click', newExercise);
				});
			} else {
				$('#overfooter').off('click');
				$('#new-exercise').slideUp("slow");
				$('.darken').hide();
				$('#overfooter').on('click', newExercise);
			}
		}
		
		$(document).on('vclick click tap', '#actives-button', function() {
			$('#exercises-content').load('actives.html');
			if($('#state-buttons').find('.selected-finished-button').length > 0) {
				var button = $('.selected-finished-button');
				button.removeClass('selected-finished-button');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-finished-exercises');
			} else if($('#state-buttons').find('.selected-ready-button').length > 0) {
				var button = $('.selected-ready-button');
				button.removeClass('selected-ready-button');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-ready-exercises');
			}
			$('#actives-button').parent().removeClass('no-selected-button');
			$('#actives-button').parent().addClass('selected-active-button');
			$('#exercises-container').addClass('selected-active-exercises');
		});
		
		$(document).on('vclick click tap', '#finished-button', function() {
			$('#exercises-content').load('finished.html');
			if($('#state-buttons').find('.selected-active-button').length > 0) {
				var button = $('div.selected-active-button');
				button.removeClass('selected-active-button');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-active-exercises');
			} else if($('#state-buttons').find('.selected-ready-button').length > 0) {
				var button = $('.selected-ready-button');
				button.removeClass('selected-ready-button');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-ready-exercises');
			}
			$('#finished-button').parent().removeClass('no-selected-button');
			$('#finished-button').parent().addClass('selected-finished-button');
			$('#exercises-container').addClass('selected-finished-exercises');
		});
		
		$(document).on('vclick click tap', '#ready-button', function() {
			$('#exercises-content').load('ready.html');
			if($('#state-buttons').find('.selected-active-button').length > 0) {
				var button = $('.selected-active-button');
				button.removeClass('selected-active-button');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-active-exercises');
			} else if($('#state-buttons').find('.selected-finished-button').length > 0) {
				var button = $('.selected-finished-button');
				button.removeClass('selected-finished-button');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-finished-exercises');
			}
			$('#ready-button').parent().removeClass('no-selected-button');
			$('#ready-button').parent().addClass('selected-ready-button');
			$('#exercises-container').addClass('selected-ready-exercises');
		});	
		
		$(document).on('vclick click tap', '#new-exercise-atras', function() {
			$('#overfooter').off('click');
			$('#new-exercise').slideUp("slow");
			$('.darken').hide();
			$('#overfooter').on('click', newExercise);
		});
		
		$(window).on('resize', function() {
			$('#header').show();
			$('#state-buttons').show();
			var offsetTop = $('#main').offset().top;
			var offsetBottom =  $('#overfooter').height() + $('#footer').height();
			var windowHeight = $(window).height();
			// DYNAMIC RESIZINGS
			$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
			$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
			//$('#exercises-container').css('top', $('#state-buttons').offset().top + $('#header').height());
			//$('#exercises-container').css('width', $('#state-buttons').width());
			//$('#exercises-content').css('width', $('#state-buttons').width());
			setTimeout(function () { myScroll.refresh() }, 0); 
			
			$('.darken').css('height', windowHeight);
			$('.darken').css('bottom', windowHeight - $('#overfooter').offset().top);
			$('#new-exercise').css('bottom', offsetBottom);
		});
	});
});

