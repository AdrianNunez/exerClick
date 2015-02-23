$(document).on('ready', function() {
	$(window).on('load', function() {
		$.ajaxSetup({ cache: false });
		// Cross domain
		$.support.cors = true;
		// Needed to get all the height
		$('#header').show();
		
		var windowHeight = $(window).height();
		var offsetTop = $('#main').offset().top;
		var offsetBottom =  $('#overfooter').height() + $('#footer').height();
		
		// DYNAMIC RESIZINGS
		$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - 2 * Math.floor(parseFloat($('body').css('font-size'))));
		$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	

		function loadData() {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/get-data.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					/*var lang = data.data[9].language;
					switch(lang) {
						case 'es':
							
							break;
						case 'eu':
							
							break;
					}*/

					$('.name').attr('data-id', data.data[0].id);
					if(data.data[1].subject != null)
						$('.subject').html(data.data[1].subject);
					var surname1 = (data.data[6] !== undefined && data.data[5].surname1 !== undefined) ? data.data[6].surname1 : '&nbsp;';
					var surname2 = (data.data[7] !== undefined && data.data[6].surname2 !== undefined) ? data.data[7].surname2 : '&nbsp;';
					$('.name').html(data.data[5].username + ' ' + surname1 + ' ' + surname2);
					
					
					showExercises();
				}
			});
			return $.Deferred().resolve();
		 }		
		
		function showExercises() {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/show-exercises.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Type: 'Active' },
				success: function(data) {
					$('#exercises-content').html("");
					if(1 == 0) {
						$('#exercises-content').html('No hay ejercicios disponibles.');
					} else {
						$.each(data.exercises, function(i, item) {
							var state = item.exercise.state.toLowerCase();
							if(state === 'nothing') {
								var background = '';
							} else {
								var background = 'background-' + state;
							}
							$('#exercises-content').append(
							'<div class=\"exercise\" data-id=\"' + item.exercise.id + '\">' +
								'<div class=\"exercise-container col-xs-12 ' + background + '\">' +
									'<div class=\"col-xs-4 col-sm-6 col-md-9 col-lg-9 exercise-name ' + background + '\">' +
										'<div class=\"ellipsis padd1 bold\">' + item.exercise.description + '</div>' +
										'<div class=\"exercise-name-icons padd3\">' + item.exercise.nofinished + '/' + item.exercise.num + ' <i class=\"fa fa-check-square-o fa-fw\"></i> ' + item.exercise.noquestions + '/' + item.exercise.num + ' <i class=\"fa fa-exclamation fa-fw\"></i></div>' +
									'</div>' +
									'<div class=\"col-xs-8 col-sm-6 col-md-3 col-lg-3 exercise-buttons ' + background + '\">' +
										'<div class=\"exercise-buttons-icons\">' +
											'<button class="' + ((state === 'finished' || (state != 'finished' && state != 'question')) ? '' : 'disabled') + ' btn btn-default btn-primary col-xs-offset-2 col-xs-4 ' +
											'button-finished"><i class="fa fa-flag"></i></button>' +
											'<button class="' + ((state === 'question'  || (state != 'finished' && state != 'question')) ? '' : 'disabled') + ' btn btn-default btn-danger col-xs-offset-2 col-xs-4 ' +
											'button-question"><i class="fa fa-exclamation"></i></button>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>'
							);
						});
					}
					loadStudentProgressBar();
				}
			});
			return $.Deferred().resolve();
		}
		
		$(document).on('vclick click tap', '.button-question', function() {
			var id = $(this).parents('.exercise').attr('data-id');
			// Both buttons are not selected
			if(!$(this).hasClass('disabled') && !$(this).siblings('.button-finished').hasClass('disabled')) {
				markExerciseAs(id, 'Question');
				var parent = $(this).parents('.exercise-container');
				parent.addClass('background-question');
				parent.find('.exercise-name').addClass('background-question');
				parent.find('.exercise-buttons').addClass('background-question');
				$(this).siblings('.button-finished').addClass('disabled');
					//parent.removeClass('background-question');
					//parent.find('.exercise-name').removeClass('background-question');
					//parent.find('.exercise-buttons').removeClass('background-question');
			} else if(!$(this).hasClass('disabled') && $(this).siblings('.button-finished').hasClass('disabled')) {
				markExerciseAs(id, 'Nothing');
				var parent = $(this).parents('.exercise-container');
				parent.removeClass('background-question');
				parent.find('.exercise-name').removeClass('background-question');
				parent.find('.exercise-buttons').removeClass('background-question');
				$(this).siblings('.button-finished').removeClass('disabled');
				$(this).removeClass('disabled');
			}
		});
		
		$(document).on('vclick click tap', '.button-finished', function() {
			var id = $(this).parents('.exercise').attr('data-id');
			// Both buttons are not selected
			if(!$(this).hasClass('disabled') && !$(this).siblings('.button-question').hasClass('disabled')) {
				markExerciseAs(id, 'Finished');
				var parent = $(this).parents('.exercise-container');
				parent.addClass('background-finished');
				parent.find('.exercise-name').addClass('background-finished');
				parent.find('.exercise-buttons').addClass('background-finished');
				$(this).siblings('.button-question').addClass('disabled');
					//parent.removeClass('background-question');
					//parent.find('.exercise-name').removeClass('background-question');
					//parent.find('.exercise-buttons').removeClass('background-question');
			} else if(!$(this).hasClass('disabled') && $(this).siblings('.button-question').hasClass('disabled')) {
				markExerciseAs(id, 'Nothing');
				var parent = $(this).parents('.exercise-container');
				parent.removeClass('background-finished');
				parent.find('.exercise-name').removeClass('background-finished');
				parent.find('.exercise-buttons').removeClass('background-finished');
				$(this).removeClass('disabled');
				$(this).siblings('.button-question').removeClass('disabled');
			}
		});
		
		function loadStudentProgressBar() {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/get-student-progress.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					$('#overfooter').find('.progress-percentage').html(data.data[0].studentprogress);
					$('#overfooter').find('.progress-bar').css('width', data.data[0].studentprogress + '%').attr('aria-valuenow', data.data[0].studentprogress); 
					if(data.data[0].studentprogress == 100) {
						$('#overfooter').find('.progress-bar').removeClass('progress-bar-info');
						$('#overfooter').find('.progress-bar').removeClass('progress-bar-warning');
						$('#overfooter').find('.progress-bar').addClass('progress-bar-success');
					} else if(data.data[0].studentprogress >= 75) {
						$('#overfooter').find('.progress-bar').removeClass('progress-bar-info');
						$('#overfooter').find('.progress-bar').addClass('progress-bar-warning');
						$('#overfooter').find('.progress-bar').removeClass('progress-bar-success');
					} else {
						$('#overfooter').find('.progress-bar').addClass('progress-bar-info');
						$('#overfooter').find('.progress-bar').removeClass('progress-bar-warning');
						$('#overfooter').find('.progress-bar').removeClass('progress-bar-success');
					}
					$('#footer').find('.progress-percentage').html(data.data[1].classprogress);
					$('#footer').find('.progress-bar').css('width', data.data[1].classprogress + '%').attr('aria-valuenow', data.data[1].classprogress); 
					if(data.data[1].classprogress == 100) {
						$('#footer').find('.progress-bar').removeClass('progress-bar-info');
						$('#footer').find('.progress-bar').removeClass('progress-bar-warning');
						$('#footer').find('.progress-bar').addClass('progress-bar-success');
					} else if(data.data[1].classprogress >= 75) {
						$('#footer').find('.progress-bar').removeClass('progress-bar-info');
						$('#footer').find('.progress-bar').addClass('progress-bar-warning');
						$('#footer').find('.progress-bar').removeClass('progress-bar-success');
					} else {
						$('#footer').find('.progress-bar').addClass('progress-bar-info');
						$('#footer').find('.progress-bar').removeClass('progress-bar-warning');
						$('#footer').find('.progress-bar').removeClass('progress-bar-success');
					}
				}
			});
			return $.Deferred().resolve();
		 }
		
		function markExerciseAs(id, markAs) {
			var idstudent = $('.name').attr('data-id');
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/mark-exercise.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Idexercise: id, State: markAs },
				success: function(data) {
					showExercises();
				}
			});
			return $.Deferred().resolve();
		}
		
		$(window).on('resize', function() {
			$('#header').show();
			var offsetTop = $('#main').offset().top;
			var offsetBottom =  $('#overfooter').height() + $('#footer').height();
			var windowHeight = $(window).height();
			// DYNAMIC RESIZINGS
			$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - 2*Math.floor(parseFloat($('body').css('font-size'))));
			$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
		});
		
		loadData();
	});
});

