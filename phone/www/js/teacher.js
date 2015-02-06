$(document).on('ready', function() {
	$(window).on('load', function() {
		// ------------------------------------------------------------------------------------------------------------------
		// 												BASICS AND CONFIGURATION
		// ------------------------------------------------------------------------------------------------------------------
		$.ajaxSetup({ cache: false });
		// Cross domain
		$.support.cors = true;

		// Needed to get all the height
		$('#header').show();
		$('#state-buttons').show();
		
		var windowHeight = $(window).height();
		var offsetTop = $('#main').offset().top;
		var offsetBottom =  $('#overfooter').height() + $('#footer').height();
		
		// ------------------------------------------------------------------------------------------------------------------
		// 													LOAD DESIGN
		// ------------------------------------------------------------------------------------------------------------------
		
		// Set the size of the containers for the exercises (needed for the scroll to appear and work)
		$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
		$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
		
		// Add the dark div which appears when a tab is shown
		$('#container').append('<div class="darken"></div>');
		$('.darken').css('height', windowHeight);
		
		// Add the "new exercise" div which appears when the '+' button is pressed (for adding new exercises)
		$('#container').append(
			'<div id="new-exercise">' +
				'<div>' +
					'<div class=\"tab-title col-xs-3"><i class=\"atras fa fa-reply btn btn-default\"></i></div>' +
					'<div class=\"tab-title col-xs-6\" align=\"center\"><h4>NUEVO EJERCICIO</h4></div>' +
					'<div class=\"tab-title col-xs-3\"><i class=\"launch-exercise fa fa-paper-plane pull-right btn ui-corner-all ui-btn-b btn-danger\"></i></div>' + 
				'</div>' +
				'<div class=\"clear\"></div>' +
				'<div class=\"row separator\"></div>' +
				'<form class=\"campos\"> ' +
					'<div class=\"col-xs-12\"><input type=\"text\" class=\"form-control\" placeholder=\"Identificador del nuevo ejercicio (número de ejercicio, nombre, etc.)\"></div>' +
					'<div class=\"clear\"></div>' +
				'</form>' +
			'</div>'
		);
		// Add some shadowing and position it
		$('#new-exercise').addClass('top-shadow');
		$('#new-exercise').css('bottom', offsetBottom);
		
		// Add click listeners
		$('#overfooter').on('click', newExercise);
		$('.darken').on('click', hideAll);
		
		// Hide both divs for showing them when asked
		$('#new-exercise').hide();
		$('.darken').hide();
		
		// ------------------------------------------------------------------------------------------------------------------
		// 												 		 FUNCTIONS
		// ------------------------------------------------------------------------------------------------------------------
		
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
		
		function countStudentsInSession(type) {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/count-students-in-session.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					showExercises(type, data.students);
				}
			});
			return $.Deferred().resolve();
		}
		
		function showExercises(type, nostudents) {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/show-exercises.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Type: type },
				success: function(data) {
					$('#exercises-content').html("");
					if(data.exercises.num == 0) {
						$('#exercises-content').html('No hay ejercicios disponibles.');
					}
					$.each(data.exercises, function(i, item) {
						$('#exercises-content').append(
						'<div class=\"exercise exercise-' + type.toLowerCase() +'\" data-id=\"' + item.exercise.id + '\">' +
							'<div class=\"exercise-container col-xs-12\">' +
								'<div class=\"col-xs-4 col-sm-6 col-md-9 col-lg-9 exercise-name\">' +
									'<div class=\"ellipsis padd1 bold\">' + item.exercise.description + '</div>' +
									'<div class=\"exercise-name-icons padd3\">' + item.exercise.nofinished + '/' + nostudents + ' <i class=\"fa fa-check-square-o fa-fw\"></i> ' + item.exercise.noquestions + '/' + nostudents + ' <i class=\"fa fa-exclamation fa-fw\"></i></div>' +
								'</div>' +
								'<div class=\"col-xs-8 col-sm-6 col-md-3 col-lg-3 exercise-buttons\">' +
									'<div class=\"exercise-buttons-icons\"><div align=\"right\">' +
										((type == 'Active') ? '' : ('<button class=\"btn btn-default btn-danger col-xs-offset-1 col-xs-3 change-to-active\"><i class=\"fa fa-paper-plane\"></i></button>')) +
										((type == 'Finished') ? '' : ('<button class=\"btn btn-default btn-primary col-xs-offset-1 col-xs-3 change-to-finished\"><i class=\"fa fa-flag\"></i></button>')) +
										//((type == 'Ready') ? '' : ('<button class=\"btn btn-default btn-warning col-xs-offset-1 col-xs-3 change-to-ready\"><i class=\"fa fa-exclamation-triangle\"></i></button>')) +
										'<button class=\"btn btn-default btn-success col-xs-offset-1 col-xs-3 statistics-button\"><i class=\"fa fa-bar-chart\"></i></button>' +
									'</div></div>' +
								'</div>' +
							'</div>' +
						'</div>'
						);
					});
					loadProgressBar();
				}
			});
			return $.Deferred().resolve();
		}
		
		function launchExercise(description) {
			$.ajax({
				type: 'GET',
				url: 'http://exerclick-api.net46.net/launch-exercise.php',
				async: false,
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Description: description },
				success: function(data) {
					hideAll();
					refresh();
				}
			});
			return $.Deferred().resolve();
		}
		
		function loadProgressBar() {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/get-session-progress.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					$('.progress-percentage').html(parseInt(data.progress));
					$('.progress-bar').css('width', parseInt(data.progress) + '%').attr('aria-valuenow', parseInt(data.progress)); 
					if(data.progress == 100) {
						$('.progress-bar').removeClass('progress-bar-info');
						$('.progress-bar').removeClass('progress-bar-warning');
						$('.progress-bar').addClass('progress-bar-success');
					} else if(data.progress >= 75) {
						$('.progress-bar').removeClass('progress-bar-info');
						$('.progress-bar').addClass('progress-bar-warning');
						$('.progress-bar').removeClass('progress-bar-success');
					} else {
						$('.progress-bar').addClass('progress-bar-info');
						$('.progress-bar').removeClass('progress-bar-warning');
						$('.progress-bar').removeClass('progress-bar-success');
					}
				}
			});
			return $.Deferred().resolve();
		 }
			
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
			return $.Deferred().resolve();
		}
		
		function showStatistics() {
			// Get the id of the exercise from the field 'data-id' (needed here before the hideAll call to work)
			var id = $(this).parents('.exercise').attr('data-id');
			$(document).off('click', '.statistics-button', showStatistics);
			// Wait for everything to hide
			hideAll().done(function() {
				$.ajax({
					type: 'GET',
					async: false,
					url: 'http://exerclick-api.net46.net/show-statistics.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { State: '%', Id: id, Key: '%' },
					success: function(data) {
						$('.darken').show();
						$('#container').append(
							'<div id=\"statistics\" data-id="' + id + '">' +
								'<div id=\"statistics-title\">' +
									'<div class=\"tab-title col-xs-2 col-lg-1\"><i class=\"atras fa fa-reply btn btn-default\"></i></div>' +
									'<div class=\"tab-title col-xs-10 col-lg-11\"><h4><i class=\"fa fa-bar-chart marginRight\"></i>1. Ejercicio</h4></div>' +
								'</div>' +
								'<div class=\"clear\"></div>' +
								'<div class=\"row separator\"></div>' +
								'<div class=\"statistics-body\">' +
									'<div id=\"statistics-buttons\">' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-all-button" class="btn btn-default btn-info active\">' +
												'<b>TODOS</b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-finished-button\" class=\"btn btn-default btn-info\">' +
												'<b><i class=\"fa fa-check-square-o fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-finished\"> 100%<span class=\"statistics-percentage statistics-percentage-finished\"> (20/78)</span></span></b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-question-button\" class=\"btn btn-default btn-info\">' +
												'<b><i class=\"fa fa-exclamation fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-question\"> 1% <span class=\"statistics-percentage statistics-percentage-question\"> (1/78)</span></span></b>' +
											'</button>' +
										'</div>' +
									'</div>' +
									'<div class=\"clear\"></div>' +
									'<div class=\"statistics-body-a\">' +
										'<div class=\"statistics-search form-group col-xs-12\">' +
											'<div class=\"col-xs-8 col-sm-10 col-md-10 col-lg-11\"><input type=\"search\" id="search-student-input" class=\"form-control\" placeholder=\"Buscar alumno\"></div>' +
											'<div class=\"col-xs-4 col-sm-2 col-md-2 col-lg-1\"><button type=\"button\" id="search-student-button" class=\"btn btn-default btn-info\"><i class=\"fa fa-search fa-fw\"></i></button></div>' +
										'</div>' +
										'<div class=\"clear\"></div>' +
										'<div class=\"statistics-list-container\">' +
											'<div class=\"statistics-list-content\">' +
												
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
						$.each(data.statistics, function(i, item) {
							switch(item.statistic.state) {
								case 'Finished':
									var divstyle = 'statistics-student-finished';
									var istyle = 'fa-check-square-o';
									break;
								case 'Question':
									var divstyle = 'statistics-student-exclamation';
									var istyle = 'fa-exclamation fa-fw';
									break;
								case 'Nothing':
									var divstyle = '';
									var istyle = '';
									break;
							}
							$('.statistics-list-content').append('<div class=\"statistics-student ' + divstyle + '\">' +
																 '<i class=\"fa ' +  istyle + '\"></i> ' + item.statistic.name + ' ' + item.statistic.surnames + '</div>');
						});
						
						$.ajax({
							type: 'GET',
							async: false,
							url: 'http://exerclick-api.net46.net/show-statistics-percentages.php',
							jsonpCallback: 'jsonCallback',
							contentType: "application/json",
							dataType: 'jsonp',
							data: { Id: id },
							success: function(data) {
								var total = data.data.total;
								var finished = data.data.finished;
								var questions = data.data.question;
								$('.statistics-percentage-finished').html(((total > 0) ? parseInt((finished / total) * 100) : 0) + '%<span class=\"statistics-percentage\"> ' + finished + '/' + total + '</span>');
								$('.statistics-percentage-question').html(((total > 0) ? parseInt((questions / total) * 100) : 0) + '%<span class=\"statistics-percentage\"> ' + questions + '/' + total + '</span>');
							}
						});
						$(document).on('click', '.statistics-button', showStatistics);
					}
				});
			});
			return $.Deferred().resolve();
		}
		
		function loadStatistics(state, id, key) {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/show-statistics.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { State: state, Id: id, Key: key },
				success: function(data) {
					$('.statistics-list-content').html('');
					$.each(data.statistics, function(i, item) {
						switch(item.statistic.state) {
							case 'Finished':
								var divstyle = 'statistics-student-finished';
								var istyle = 'fa-check-square-o';
								break;
							case 'Question':
								var divstyle = 'statistics-student-exclamation';
								var istyle = 'fa-exclamation fa-fw';
								break;
							case 'Nothing':
								var divstyle = '';
								var istyle = '';
								break;
						}
						$('.statistics-list-content').append('<div class=\"statistics-student ' + divstyle + '\">' +
															 '<i class=\"fa ' +  istyle + '\"></i> ' + item.statistic.name + ' ' + item.statistic.surnames + '</div>');
					});
				}
			});
			return $.Deferred().resolve();
		}
		
		function changeExerciseType(id, to) {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/change-exercise.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Id: id, Type: to },
				success: function(data) {
					refresh();
					return $.Deferred().resolve();
				}
			});
		}
		
		function refresh() {
			if($('#state-buttons').find('.selected-active-button').length > 0) {
				countStudentsInSession('Active');
			} else if($('#state-buttons').find('.selected-finished-button').length > 0) {
				countStudentsInSession('Finished')
			} else if($('#state-buttons').find('.selected-ready-button').length > 0) {
				countStudentsInSession('Ready')
			}
			return $.Deferred().resolve();
		}
		
		// ------------------------------------------------------------------------------------------------------------------
		// 												  MAIN CALL AND ACTION LISTENERS
		// ------------------------------------------------------------------------------------------------------------------
		
		// Call the main function to load content and then add the action listeners
		countStudentsInSession('Active').done(function() {
			$(document).on('vclick click tap', '.atras', hideAll);
			$(document).on('click', '.statistics-button', showStatistics);
			
			$(document).on('vclick click tap', '#actives-button', function() {
				$('#exercises-content').html("");
				countStudentsInSession('Active');
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
				$('#exercises-content').html("");
				countStudentsInSession('Finished');
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
				$('#exercises-content').html("");
				countStudentsInSession('Ready');
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
			
			$(document).on('vclick click tap', '.change-to-active', function() {
				var id = $(this).parents('.exercise').attr('data-id');
				changeExerciseType(id, 'Active');
			});
			
			$(document).on('vclick click tap', '.change-to-finished', function() {
				var id = $(this).parents('.exercise').attr('data-id');
				changeExerciseType(id, 'Finished');
			});
			
			$(document).on('vclick click tap', '.change-to-ready', function() {
				var id = $(this).parents('.exercise').attr('data-id');
				changeExerciseType(id, 'Ready');
			});
			
			$(document).on('vclick click tap', '#statistics-all-button', function() {
				if($('#statistics-finished-button').hasClass('active')) {
					$('#statistics-finished-button').removeClass('active');
				} else if($('#statistics-question-button').hasClass('active')) {		
					$('#statistics-question-button').removeClass('active');
				}
				$('#statistics-all-button').addClass('active');
				var id = $(this).parents('#statistics').attr('data-id');
				loadStatistics('%', id, '%');
			});
			
			$(document).on('vclick click tap', '#statistics-finished-button', function() {
				if($('#statistics-all-button').hasClass('active')) {
					$('#statistics-all-button').removeClass('active');
				} else if($('#statistics-question-button').hasClass('active')) {		
					$('#statistics-question-button').removeClass('active');
				}
				$('#statistics-finished-button').addClass('active');
				var id = $(this).parents('#statistics').attr('data-id');
				loadStatistics('Finished', id, '%');
			});
			
			$(document).on('vclick click tap', '#statistics-question-button', function() {
				if($('#statistics-all-button').hasClass('active')) {
					$('#statistics-all-button').removeClass('active');
				} else if($('#statistics-finished-button').hasClass('active')) {		
					$('#statistics-finished-button').removeClass('active');
				}
				$('#statistics-question-button').addClass('active');
				var id = $(this).parents('#statistics').attr('data-id');
				loadStatistics('Question', id, '%');
				
			});			
			
			$(document).on('vclick click tap', '#search-student-button', function() {
				if($('#statistics-all-button').hasClass('active')) {
					var state = '%';
				} else if($('#statistics-finished-button').hasClass('active')) {		
					var state = 'Finished';
				} else if($('#statistics-question-button').hasClass('active')) {		
					var state = 'Question';
				}
				var id = $(this).parents('#statistics').attr('data-id');
				var key = $('#search-student-input').val();
				loadStatistics(state, id, '%' + key + '%');
			});
			
			$(document).on('keyup', '#search-student-input', function() {
				if($('#statistics-all-button').hasClass('active')) {
					var state = '%';
				} else if($('#statistics-finished-button').hasClass('active')) {		
					var state = 'Finished';
				} else if($('#statistics-question-button').hasClass('active')) {		
					var state = 'Question';
				}
				var id = $(this).parents('#statistics').attr('data-id');
				var key = $('#search-student-input').val();
				loadStatistics(state, id, '%' + key + '%');
			});
			
			$(document).on('vclick click tap', '.launch-exercise', function() {
				var description = $(this).parents('#new-exercise').find('input').val();
				launchExercise(description);
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
});

