/*$(document).on('ready', function() {

	pushNotification = window.plugins.pushNotification;
	
	//$("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
	pushNotification.register( successHandler, errorHandler, { 'senderID':'86663666263', 'ecb':'onNotification' } );

	function successHandler (result) {
		alert('result = ' + result);
	}
	
	function errorHandler (error) {
		alert('error = ' + error);
	}
	
	// iOS
	function onNotificationAPN (event) {
		if ( event.alert )
		{
			navigator.notification.alert(event.alert);
		}

		if ( event.sound )
		{
			var snd = new Media(event.sound);
			snd.play();
		}

		if ( event.badge )
		{
			pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
		}
	}
	
	// Android and Amazon Fire OS
	function onNotification(e) {
		//$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

		switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
	}
});*/

$(document).on('ready', function() {
	$(window).on('load', function() {
		
		domain = 'https://galan.ehu.eus/exerclick/';
		lang = '';
		
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
		
		$('#container').append('<div class="darken"></div>');
		$('.darken').css('height', windowHeight);
		$('.darken').hide();
		$('.darken').on('click', hideAll);

		function loadData() {
			$.ajax({
				type: 'GET',
				async: false,
				url: domain + 'get-data.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					lang = data.data[9].language;

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
		 
		 function hideAll() {
			if($('#exercise-details').length) {
				$('#exercise-details').slideUp("slow", function() {
					$('#exercise-details').remove();
				});
			}
			$('.darken').hide();
			return $.Deferred().resolve();
		}
		
		function showExercises() {
			$.ajax({
				type: 'GET',
				async: false,
				url: domain + 'show-exercises.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Type: 'Active' },
				success: function(data) {
					$('#exercises-content').html("");
					if(data.exercises == undefined) {
						if($('#container').find('#toast').length) {
							if($('#container').find('#toast').hasClass('error2')) {
								$('#toast').remove();
								$('#container').append('<div id="toast" class="error1"><div id="toast-content"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-11">&nbsp;</span></div></div>');
								$('#toast').hide().fadeIn('slow');
							}
						} else {
							$('#container').append('<div id="toast" class="error1"><div id="toast-content"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-11">&nbsp;</span></div></div>');
							$('#toast').hide().fadeIn('slow');
						}
						switch(lang) {
						case 'es':
							$('#translation-11').html('Ha ocurrido un error al cargar los ejercicios.');
							break;
						case 'eu':
							$('#translation-11').html('Errore bat egon da ariketak kargatzerakoan.');
							break;
						case 'en':
							$('#translation-11').html('An error has occurred while trying to load the exercises.');
							break;
						case 'fr':
							$('#translation-11').html('Il y a un erreur en chargeant des exercices');
							break;
						}
					} else if(data.exercises.length == 0) {
						if($('#container').find('#toast').length) {
							if($('#container').find('#toast').hasClass('error1')) {
								$('#toast').remove();
								$('#container').append('<div id="toast" class="error2"><div id="toast-content"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-12">&nbsp;</span></div></div>');
								$('#toast').hide().fadeIn('slow');
							}
						} else {
							$('#container').append('<div id="toast" class="error2"><div id="toast-content"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-12">&nbsp;</span></div></div>');
							$('#toast').hide().fadeIn('slow');
						}
						switch(lang) {
						case 'es':
							$('#translation-12').html('No hay ejercicios disponibles.');
							break;
						case 'eu':
							$('#translation-12').html('Ez dago ariketarik.');
							break;
						case 'en':
							$('#translation-12').html('No available exercises.');
							break;
						case 'fr':
							$('#translation-12').html('Il n’y a pas des exercices disponibles');
							break;
						}
					} else {
						if($('#container').find('#toast').length)
							$('#toast').remove();
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
											'button-finished"><i class="fa fa-flag-checkered"></i></button>' +
											'<button class="' + ((state === 'question'  || (state != 'finished' && state != 'question')) ? '' : 'disabled') + ' btn btn-default btn-danger col-xs-offset-2 col-xs-4 ' +
											'button-question"><i class="fa fa-exclamation"></i></button>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>'
							);
						});
					}
					if ($(window).width() <= 480) {
						$('.button-finished').addClass('btn-xs');
						$('.button-question').addClass('btn-xs');
					}
					loadStudentProgressBar();
				}
			});
			return $.Deferred().resolve();
		}
		
		function showExerciseDetails(id) {
			// Wait for everything to hide
			hideAll().done(function() {
				$.ajax({
					type: 'GET',
					async: false,
					url: domain + 'get-exercise-details.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { Id: id },
					success: function(data) {
						$('.darken').show();
						var details = '<div id=\"exercise-details\" data-id="' + data.exercise.id + '">' +
								'<div id=\"exercise-details-title\">' +
									'<div class=\"tab-title col-xs-3"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
									'<div class=\"tab-title col-xs-9\" align=\"left\"><h4 class="exercise-detail-description">' + data.exercise.description + '</h4></div>' +
								'</div>' +
								'<div class=\"clear\"></div>' +
								'<div class=\"separator\"></div>' +
								'<div class=\"exercise-details-body\">' +
									'<div class=\"exercise-details-content\">';
								
						var something = false;

						if(data.exercise.statement != null && data.exercise.statement != '')
							something = true;
						details += '<div class="exercise-details-title exercise-details-title-1 col-xs-12"><span id="translation-27">&nbsp;</span></div><p class="col-xs-12 exercise-detail-statement">' + data.exercise.statement + '</p>';				
						
						if(data.exercise.topic != null && data.exercise.topic != '')	
							something = true;
						details += '<div class="exercise-details-title exercise-details-title-2 col-lg-2 col-md-6 col-sm-6 col-xs-12 bottompad"><span id="translation-28">&nbsp;</span></div><div class="exercise-detail exercise-detail-topic col-lg-2 col-md-6 col-sm-6 col-xs-12">' + data.exercise.topic + '</div>';
						
						if(data.exercise.page != null && data.exercise.page != '')	
							something = true;
						details += '<div class=\"hidden-lg clear\"></div><div class="exercise-details-title exercise-details-title-3 col-lg-2 col-md-6 col-sm-6 col-xs-12 bottompad"><span id="translation-29">&nbsp;</span></div><div class="exercise-detail exercise-detail-page col-lg-2 col-md-6 col-sm-6 col-xs-12">' + data.exercise.page + '</div>';		

						if(data.exercise.difficulty != null && data.exercise.difficulty != '')
							something = true;
						details += '<div class=\"hidden-lg clear\"></div><div class="exercise-details-title exercise-details-title-4 col-lg-2 col-md-6 col-sm-6 col-xs-12 bottompad"><span id="translation-30">&nbsp;</span></div><div class="exercise-detail exercise-detail-difficulty col-lg-2 col-md-6 col-sm-6 col-xs-12">' + data.exercise.difficulty + '</div>';
						
						
						if(!something) {
							details += '<div id="toast-details"><div id="toast-content"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-32">&nbsp;</span></div></div>';
						}

						$('#container').append(details + '</div></div></div><div class=\"clear\">');
						
						if(data.exercise.statement == null || data.exercise.statement == '') {
							$('.exercise-details-title-1').hide();
							$('.exercise-detail-statement').hide();
						}
						
						if(data.exercise.topic == null || data.exercise.topic == '') {
							$('.exercise-details-title-2').hide();
							$('.exercise-detail-topic').hide();
						}
						
						if(data.exercise.page == null || data.exercise.page == '') {
							$('.exercise-details-title-3').hide();
							$('.exercise-detail-page').hide();
						}
						
						if(data.exercise.difficulty == null || data.exercise.difficulty == '') {
							$('.exercise-details-title-4').hide();
							$('.exercise-detail-difficulty').hide();
						}
						
						switch(lang) {
						case 'es':
							$('#translation-27').html('ENUNCIADO');
							$('#translation-28').html('TEMA');
							$('#translation-29').html('PÁGINA');
							$('#translation-30').html('DIFICULTAD');
							$('#translation-32').html('No hay ningún detalle asociado a este ejercicio.');
							break;
						case 'eu':
							$('#translation-27').html('ENUNTZIATUA');
							$('#translation-28').html('GAIA');
							$('#translation-29').html('ORRIALDEA');
							$('#translation-30').html('SAILTASUNA');
							$('#translation-32').html('Ez dago xehetasunik ariketa honekin erlazionatuta.');
							break;
						case 'en':
							$('#translation-27').html('STATEMENT');
							$('#translation-28').html('TOPIC');
							$('#translation-29').html('PAGE');
							$('#translation-30').html('DIFFICULTY');
							$('#translation-32').html('No details associated to this exercise.');
							break;
						case 'fr':
							$('#translation-27').html('ENONCÉ');
							$('#translation-28').html('SUJET');
							$('#translation-29').html('PAGE');
							$('#translation-30').html('DIFFICULTÉ');
							$('#translation-32').html('Il n’y a pas des détails associés à cet exercice.');
							break;
						}
						$('#header').show();
						$('#state-buttons').show();
						var windowHeight = $(window).height();
						var offsetTop = $('#main').offset().top;
						var offsetBottom =  $('#overfooter').height() + $('#footer').height();
						
						$('#exercise-details').css('bottom', offsetBottom);
						$('#exercise-details').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
						$('.exercise-details-body').css('height', $('#exercise-details').height() - 2 * $('.exercise-details-title').height() - Math.floor(parseFloat($('body').css('font-size'))));
						$('.exercise-details-content').css('height', $('.exercise-details-body').height() - 1);
						$('#exercise-details').hide();
						$('#exercise-details').addClass('top-shadow');
						$('#exercise-details').slideDown("slow");
					}	
				});
			});
			return $.Deferred().resolve();
		}
		
		$(document).on('vclick click tap', '.button-question', function(e) {
			e.stopPropagation();
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
		
		$(document).on('vclick click tap', '.button-finished', function(e) {
			e.stopPropagation();
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
				url: domain + 'get-student-progress.php',
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
				url: domain + 'mark-exercise.php',
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
		
		$(document).on('vclick click tap', '.exercise', function() {
			var id = $(this).attr('data-id');
			showExerciseDetails(id);	
		});
		
		$(document).on('vclick click tap', '.back', hideAll);
		
		function refresh() {
			showExercises('Active');
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
			
			if ($(window).width() <= 480) {
				$('.button-finished').addClass('btn-xs');
				$('.button-question').addClass('btn-xs');
			} else {
				$('.button-finished').removeClass('btn-xs');
				$('.button-question').removeClass('btn-xs');
			}

			if($('#exercise-details').length != 0) {
				$('#exercise-details').css('bottom', offsetBottom);
				$('#exercise-details').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
				$('.exercise-details-body').css('height', $('#exercise-details').height() - 2 * $('.exercise-details-title').height() - Math.floor(parseFloat($('body').css('font-size'))));
				$('.exercise-details-content').css('height', $('.exercise-details-body').height() - 1);
			}		
		});
		
		loadData();
		setInterval(refresh, 3000);
	});
});

