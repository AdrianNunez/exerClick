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
		$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - 2*Math.floor(parseFloat($('body').css('font-size'))));
		$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));		
		
		function showExercises(nostudents) {
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
							if(state === 'nothing') var background = '';
							else background = 'background-' + state;
							$('#exercises-content').append(
							'<div class=\"exercise\" data-id=\"' + item.exercise.id + '\">' +
								'<div class=\"exercise-container col-xs-12 ' + background + '\">' +
									'<div class=\"col-xs-4 col-sm-6 col-md-9 col-lg-9 exercise-name ' + background + '\">' +
										'<div class=\"ellipsis padd1 bold\">' + item.exercise.description + '</div>' +
										'<div class=\"exercise-name-icons padd3\">' + item.exercise.nofinished + '/' + nostudents + ' <i class=\"fa fa-check-square-o fa-fw\"></i> ' + item.exercise.noquestions + '/' + nostudents + ' <i class=\"fa fa-exclamation fa-fw\"></i></div>' +
									'</div>' +
									'<div class=\"col-xs-8 col-sm-6 col-md-3 col-lg-3 exercise-buttons ' + background + '\">' +
										'<div class=\"exercise-buttons-icons\"><div align=\"right\">' +
											'<button class="' + ((state === 'finished') ? '' : 'not-selected') + ' btn btn-default btn-primary col-xs-offset-2 col-xs-4 button-finished"><i class="fa fa-flag"></i></button>' +
											'<button class="' + ((state === 'question') ? '' : 'not-selected') + ' btn btn-default btn-danger col-xs-offset-2 col-xs-4 button-question"><i class="fa fa-exclamation"></i></button>' +
										'</div></div>' +
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
		
		$(document).on('vclick click tap', '.button-finished', function() {
			var id = $(this).parents('.exercise').attr('data-id');
			if($(this).hasClass('not-selected')) {
				markExerciseAs(id, 'Finished');
				$(this).removeClass('not-selected');
				var parent = $(this).parents('.exercise-container');
				parent.addClass('background-finished');
				parent.find('.exercise-name').addClass('background-finished');
				parent.find('.exercise-buttons').addClass('background-finished');
				if(!$(this).siblings('.button-question').hasClass('not-selected')) {
					$(this).siblings('.button-question').addClass('not-selected');
					parent.removeClass('background-question');
					parent.find('.exercise-name').removeClass('background-question');
					parent.find('.exercise-buttons').removeClass('background-question');
				}
			} else {
				markExerciseAs(id, 'Nothing');
				var parent = $(this).parents('.exercise-container');
				parent.removeClass('background-finished');
				parent.find('.exercise-name').removeClass('background-finished');
				parent.find('.exercise-buttons').removeClass('background-finished');
				$(this).addClass('not-selected');
			}
		});
		
		$(document).on('vclick click tap', '.button-question', function() {
			var id = $(this).parents('.exercise').attr('data-id');
			if($(this).hasClass('not-selected')) {
				markExerciseAs(id, 'Question');
				$(this).removeClass('not-selected');
				var parent = $(this).parents('.exercise-container');
				parent.addClass('background-question');
				parent.find('.exercise-name').addClass('background-question');
				parent.find('.exercise-buttons').addClass('background-question');
				if(!$(this).siblings('.button-finished').hasClass('not-selected')) {
					$(this).siblings('.button-finished').addClass('not-selected');
					parent.removeClass('background-finished');
					parent.find('.exercise-name').removeClass('background-finished');
					parent.find('.exercise-buttons').removeClass('background-finished');
				}
			} else {
				markExerciseAs(id, 'Nothing');
				var parent = $(this).parents('.exercise-container');
				parent.removeClass('background-question');
				parent.find('.exercise-name').removeClass('background-question');
				parent.find('.exercise-buttons').removeClass('background-question');
				$(this).addClass('not-selected');
			}
		});
		
		function countStudentsInSession() {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/count-students-in-session.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					showExercises(data.students);
				}
			});
			return $.Deferred().resolve();
		}
		
		function loadStudentProgressBar() {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/get-student-progress.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Idstudent: '1' },
				success: function(data) {
					$('#overfooter').find('.progress-percentage').html(parseInt(data.progress));
					$('#overfooter').find('.progress-bar').css('width', parseInt(data.progress) + '%').attr('aria-valuenow', parseInt(data.progress)); 
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
		
		function markExerciseAs(id, markAs) {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/mark-exercise.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Idexercise: id, State: markAs },
				success: function(data) {
					refresh();
				}
			});
			return $.Deferred().resolve();
		}
		
		function refresh() {
			countStudentsInSession();
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
		
		countStudentsInSession();
	});
});

