$(document).on('ready', function() {
	$(window).on('load', function() {
		// Needed to get all the height
		$('#header').show();
		$('#state-buttons').show();
		
		var windowHeight = $(window).height();
		var offsetTop = $('#main').offset().top;
		var offsetBottom =  $('#overfooter').height() + $('#footer').height();
		
		// DYNAMIC RESIZINGS
		$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
		$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
		$('#exercises-content').load('actives.html');
		
		// Add the dark div
		$('#container').append('<div class="darken"></div>');
		$('.darken').css('height', windowHeight);
		
		// Add the new-exercise div
		$('#container').append(
			'<div id="new-exercise">' +
				'<div>' +
					'<div class="tab-title col-xs-3"><i class="atras fa fa-reply btn btn-default"></i></div>' +
					'<div class="tab-title col-xs-6" align="center"><h4>NUEVO EJERCICIO</h4></div>' +
					'<div class="tab-title col-xs-3"><i class="fa fa-paper-plane pull-right btn ui-corner-all ui-btn-b btn-warning"></i></div>' + 
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
		$('.darken').on('click', hideAll);
		
		$('#new-exercise').css('bottom', offsetBottom);
		
		// Occult both divs
		$('#new-exercise').hide();
		$('.darken').hide();
			
		function newExercise() {
			hideAll().done(function() {
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
			});
		}
		
		function hideAll() {
			if(!$('#new-exercise').is(':hidden')) {
				$('#overfooter').off('click');
				$('#new-exercise').slideUp("slow");
				$('#overfooter').on('click', newExercise);
			}
			if($('#statistics').length) {
				$('#statistics').slideUp("slow", function() {
					$('#statistics').remove();
				});
			}
			$('.darken').hide();
			return $.Deferred().resolve();
		}
		
		$(document).on('vclick click tap', '.atras', hideAll);
		
		$(document).on('vclick click tap', '#actives-button', function() {
			$('#exercises-content').load('actives.html');
			if($('#state-buttons').find('.selected-finished-button').length > 0) {
				var button = $('.selected-finished-button');
				button.removeClass('selected-finished-button');
				$('#finished-button').removeClass('active');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-finished-exercises');
			} else if($('#state-buttons').find('.selected-ready-button').length > 0) {
				var button = $('.selected-ready-button');
				button.removeClass('selected-ready-button');
				$('#ready-button').removeClass('active');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-ready-exercises');
			}
			$('#actives-button').parent().removeClass('no-selected-button');
			$('#actives-button').parent().addClass('selected-active-button');
			$('#actives-button').addClass('active');
			$('#exercises-container').addClass('selected-active-exercises');
		});
		
		$(document).on('vclick click tap', '#finished-button', function() {
			$('#exercises-content').load('finished.html');
			if($('#state-buttons').find('.selected-active-button').length > 0) {
				var button = $('div.selected-active-button');
				button.removeClass('selected-active-button');
				$('#actives-button').removeClass('active');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-active-exercises');
			} else if($('#state-buttons').find('.selected-ready-button').length > 0) {
				var button = $('.selected-ready-button');
				button.removeClass('selected-ready-button');
				$('#ready-button').removeClass('active');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-ready-exercises');
			}
			$('#finished-button').parent().removeClass('no-selected-button');
			$('#finished-button').parent().addClass('selected-finished-button');
			$('#finished-button').addClass('active')
			$('#exercises-container').addClass('selected-finished-exercises');
		});
		
		$(document).on('vclick click tap', '#ready-button', function() {
			$('#exercises-content').load('ready.html');
			if($('#state-buttons').find('.selected-active-button').length > 0) {
				var button = $('.selected-active-button');
				button.removeClass('selected-active-button');
				$('#actives-button').removeClass('active');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-active-exercises');
			} else if($('#state-buttons').find('.selected-finished-button').length > 0) {
				var button = $('.selected-finished-button');
				button.removeClass('selected-finished-button');
				$('#finished-button').removeClass('active');
				button.addClass('no-selected-button');
				$('#exercises-container').removeClass('selected-finished-exercises');
			}
			$('#ready-button').parent().removeClass('no-selected-button');
			$('#ready-button').parent().addClass('selected-ready-button');
			$('#ready-button').addClass('active');
			$('#exercises-container').addClass('selected-ready-exercises');
		});	
		
		function searchStudent(name) {
			alert("hola");
			var div = $('*:contains("' + name + '")');
			alert(div);
		}
		
		$(document).on('click', '.statistics-button', showStatistics);
		
		function showStatistics() {
			$('#container').append(
				'<div id="statistics">' +
					'<div id="statistics-title">' +
						'<div class="tab-title col-xs-2 col-lg-1"><i class="atras fa fa-reply btn btn-default"></i></div>' +
						'<div class="tab-title col-xs-10 col-lg-11"><h4><i class="fa fa-bar-chart marginRight"></i>1. Ejercicio</h4></div>' +
					'</div>' +
					'<div class="clear"></div>' +
					'<div class="row separator"></div>' +
					'<div class="statistics-body">' +
						'<div id="statistics-buttons">' +
							'<div class="col-xs-4">' +
								'<button type="button" id="statistics-all-button" class="btn btn-default btn-info active">' +
									'<b>TODOS</b>' +
								'</button>' +
							'</div>' +
							'<div class="col-xs-4">' +
								'<button type="button" id="statistics-finished-button" class="btn btn-default btn-info">' +
									'<b><i class="fa fa-check-square-o fa-fw"></i><span class="statistics-button-data"> 100%<span class="statistics-percentage"> (20/78)</span></span></b>' +
								'</button>' +
							'</div>' +
							'<div class="col-xs-4">' +
								'<button type="button" id="statistics-attention-button" class="btn btn-default btn-info">' +
									'<b><i class="fa fa-exclamation fa-fw"></i><span class="statistics-button-data"> 1% <span class="statistics-percentage"> (1/78)</span></span></b>' +
								'</button>' +
							'</div>' +
						'</div>' +
						'<div class="clear"></div>' +
						'<div class="statistics-body-a">' +
							'<div class="statistics-search form-group col-xs-12">' +
								'<div class="col-xs-8 col-sm-10 col-md-10 col-lg-11"><input type="search" class="form-control" placeholder="Buscar alumno" onSearch="searchStudent(this.value)"></div>' +
								'<div class="col-xs-4 col-sm-2 col-md-2 col-lg-1"><button type="button" class="btn btn-default btn-info searchStudent-button"><i class="fa fa-search fa-fw"></i></button></div>' +
							'</div>' +
							'<div class="clear"></div>' +
							'<div class="statistics-list-container">' +
								'<div class="statistics-list-content">' +
									'<div class="statistics-student statistics-student-exclamation"><i class="fa fa-exclamation fa-fw"></i> Adrián Núñez</div>' +
									'<div class="statistics-student statistics-student-finished"><i class="fa fa-check-square-o fa-fw"></i> Asier Mujika</div>' +
									'<div class="statistics-student statistics-student-exclamation"><i class="fa fa-exclamation fa-fw"></i> Xabier Zabala</div>' +
									'<div class="statistics-student statistics-student-exclamation"><i class="fa fa-exclamation fa-fw"></i> Uxue Arostegui</div>' +
									'<div class="statistics-student statistics-student-finished"><i class="fa fa-check-square-o fa-fw"></i> Iván Matellanes</div>' +
									'<div class="statistics-student statistics-student-finished"><i class="fa fa-check-square-o fa-fw"></i> Erik Noriega</div>' +
									'<div class="statistics-student statistics-student-finished"><i class="fa fa-check-square-o fa-fw"></i> Iván Matellanes</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>'
			);
			$('#header').show();
			$('#state-buttons').show();
			var windowHeight = $(window).height();
			var offsetTop = $('#main').offset().top;
			var offsetBottom =  $('#overfooter').height() + $('#footer').height();
			
			$('#statistics').css('bottom', offsetBottom);
			$('#statistics').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());

			$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top - 2*$('.statistics-search').height() - Math.floor(parseFloat($('body').css('font-size'))));
			$('.statistics-list-content').css('height', $('.statistics-list-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
			$('#statistics').hide();
			$('#statistics').addClass('top-shadow');
			$('#statistics').slideDown("slow");
			$('.darken').show();
		}
		
		$(document).on('vclick click tap', '#statistics-all-button', function() {
			if($('#statistics-finished-button').hasClass('active')) {
				$('#statistics-finished-button').removeClass('active');
			} else if($('#statistics-attention-button').hasClass('active')) {		
				$('#statistics-attention-button').removeClass('active');
			}
			$('#statistics-all-button').addClass('active');
		});
		
		$(document).on('vclick click tap', '#statistics-finished-button', function() {
			if($('#statistics-all-button').hasClass('active')) {
				$('#statistics-all-button').removeClass('active');
			} else if($('#statistics-attention-button').hasClass('active')) {		
				$('#statistics-attention-button').removeClass('active');
			}
			$('#statistics-finished-button').addClass('active');
		});
		
		$(document).on('vclick click tap', '#statistics-attention-button', function() {
			if($('#statistics-all-button').hasClass('active')) {
				$('#statistics-all-button').removeClass('active');
			} else if($('#statistics-finished-button').hasClass('active')) {		
				$('#statistics-finished-button').removeClass('active');
			}
			$('#statistics-attention-button').addClass('active');
		});	
		
		$(window).on('resize', function() {
			$('#header').show();
			$('#state-buttons').show();
			var windowHeight = $(window).height();
			var offsetTop = $('#main').offset().top;
			var offsetBottom =  $('#overfooter').height() + $('#footer').height();
			
			// DYNAMIC RESIZINGS
			$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
			$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
			
			$('.darken').css('height', windowHeight);
			$('.darken').css('bottom', windowHeight - $('#overfooter').offset().top);
			$('#new-exercise').css('bottom', offsetBottom);

			$('#header').show();
			$('#state-buttons').show();
			var windowHeight = $(window).height();
			var offsetTop = $('#main').offset().top;
			var offsetBottom =  $('#overfooter').height() + $('#footer').height();
			
			$('#statistics').css('bottom', offsetBottom);
			$('#statistics').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());

			$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top - 2*$('.statistics-search').height() - Math.floor(parseFloat($('body').css('font-size'))));
			$('.statistics-list-content').css('height', $('.statistics-list-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
		});
	});
});

