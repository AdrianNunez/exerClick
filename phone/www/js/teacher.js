$(document).on('ready', function() {
	$(window).on('load', function() {
		domain = 'https://galan.ehu.eus/exerclick/';
		lang = 'es';
		attendanceclass = 'No class';
		
		// ------------------------------------------------------------------------------------------------------------------
		// 												BASICS AND CONFIGURATION
		// ------------------------------------------------------------------------------------------------------------------
		$.ajaxSetup({ cache: false, async: false });
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
			'<div id="new-exercise" class="ehuSans">' +
				'<div class="new-exercise-title">' +
					'<div class=\"tab-title col-xs-3"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
					'<div class=\"tab-title col-xs-6\" align=\"center\"><h4><span id="translation-13">&nbsp;</span></h4></div>' +
					'<div class=\"tab-title col-xs-3\"><i class=\"launch-exercise fa fa-paper-plane pull-right btn ui-corner-all ui-btn-b btn-danger\"></i></div>' + 
				'</div>' +
				'<div class=\"clear\"></div>' +
				'<div class=\"separator\"></div>' +
				'<form class=\"campos\"> ' +
					'<div id="translation-14" class=\"col-xs-12\"><input type=\"text\" class=\"form-control\" id="input-exercise-id"></div>' +
					'<div class=\"clear\"></div>' +
					'<div class=\"advanced-container\"><div class=\"advanced-content\"></div></div>' +
					'<div class=\"clear\"></div>' +
					'<div class=\"extraMargin\"></div>' +
					'<div class=\"clear\"></div>' +
					'<div class="new-exercise-buttons">' +
						'<div class="col-xs-6"><button type="button" class="btn btn-default btn-warning save-exercise">' +
							'<span class="badge left"><i class="fa fa-exclamation-triangle fa-fw"></i></span><div class="visible-sm visible-md visible-lg bold"><span id="translation-19" class="bold">&nbsp;</span></div>' +
						'</button></div>' +
						'<div class="col-xs-6"><button type="button" class="btn btn-default btn-primary advanced-exercise">' +
							'<span id="translation-20" class="bold">&nbsp;</span>' +
						'</button></div>' +
					'</div>' +
					'<div class=\"extraMargin\"></div>' +
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

		$('.advanced-content').html(
			'<div id="translation-15" class=\"col-xs-12 bottompadd toppadd\"><textarea class=\"form-control\" id="input-exercise-statement" rows="5"></textarea></div>' +
			'<div class=\"clear\"></div>' +
			'<div id="translation-16" class=\"col-xs-12 bottompadd\"><input type=\"text\" class=\"form-control\" id="input-exercise-topic"></div>' +
			'<div class=\"clear\"></div>' +
			'<div id="translation-17" class=\"col-xs-12 bottompadd\"><input type=\"text\" class=\"form-control\" id="input-exercise-page"></div>' +
			'<div class=\"clear\"></div>' +
			'<div class=\"difficulty bottompadd col-xs-12\">' +
				'<input type="number" id="input-exercise-difficulty" class="difficulty-slider col-xs-12" min="1" max="10" value="5">' +
			'</div>' +
			'<div class="col-xs-12"><div id="translation-18"></div></div>'
		);
		$('.advanced-container').show();
		$('.campos').css('height', $('#input-exercise-id').height() + 5*Math.floor(parseFloat($('body').css('font-size'))) + $('.save-exercise').height());
		$('.advanced-container').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
		$('.advanced-content').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
		$('.difficulty-slider').on('keyup mouseup', function(ev){
			$('.difficulty-level').html($('#input-exercise-difficulty').val());
		});
		
		// Hide divs for showing them when asked
		$('#new-exercise').hide();
		$('.darken').hide();
		$('.advanced-container').hide();			

		// ------------------------------------------------------------------------------------------------------------------
		// 												 		 FUNCTIONS
		// ------------------------------------------------------------------------------------------------------------------
		
		function hideAll() {
			if(!$('#new-exercise').is(':hidden')) {
				$('.campos').find("input[type=text], textarea").val("")
				$('#overfooter').off('click');
				$('#new-exercise').slideUp("slow");
				$('#overfooter').on('click', newExercise);
			}		
			if($('#statistics').length) {
				$('#statistics').slideUp("slow", function() {
					$('#statistics').remove();
				});
			}
			if($('#exercise-details').length) {
				$('#exercise-details').slideUp("slow", function() {
					$('#exercise-details').remove();
				});
			}
			$('.darken').hide();
			return $.Deferred().resolve();
		}
		
		function loadData() {
			$.ajax({
				type: 'GET',
				url: domain + 'get-data.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					if(data.activesession != undefined && !data.activesession) {
						window.location.replace('index.html');
					} else {
						lang = data.data[9].language;
						switch(lang) {
							case 'es':
								// Profile 
								$('#translation-1').html('PERFIL DE <span class=\"name\"></span>');
								$('#translation-2').html('IR A CLASE');
								$('#translation-3').html('Estás en la asignatura de <span class="subject"></span>');
								$('#translation-4').html('ASIGNATURA');
								$('#translation-5').html('IDIOMA');
								$('#translation-6').html('CERRAR SESIÓN');
								
								// State buttons
								$('#translation-7').html('ACTIVOS');
								$('#translation-8').html('FINALIZADOS');
								$('#translation-9').html('PREPARADOS');
								
								// Progress bar
								$('#translation-10').html('<span class=\"progress-percentage\">0</span>% completado');
								
								// New exercise tab
								$('#translation-13').html('NUEVO EJERCICIO');
								$('#translation-14').find('input').attr('placeholder', 'Identificador del nuevo ejercicio (número de ejercicio, nombre, etc.)');
								$('#translation-15').find('textarea').attr('placeholder', 'Enunciado');
								$('#translation-16').find('input').attr('placeholder', 'Tema');
								$('#translation-17').find('input').attr('placeholder', 'Página');
								$('#translation-18').html('Dificultad: <span class="difficulty-level">5</span>');
								$('#translation-19').html('GUARDAR EJERCICIO');
								$('#translation-20').html('MÁS');
								
								// Languages of the profile
								$('select.language-select').empty();
								$('select.language-select').append('<option value="1">Castellano</option>');
								$('select.language-select').append('<option value="2">Euskera</option>');
								$('select.language-select').append('<option value="3">Inglés</option>');
								$('select.language-select').append('<option value="4">Francés</option>');
								break;
							case 'eu':
								// Profile 
								$('#translation-1').html('<span class=\"name\"></span>-(R)EN PROFILA');
								$('#translation-2').html('KLASERA JOAN');
								$('#translation-3').html('<span class=\"subject\"></span> irakasgaian zaude');
								$('#translation-4').html('IRAKASGAIA');
								$('#translation-5').html('HIZKUNTZA');
								$('#translation-6').html('SAIOA ITXI');
								
								// State buttons
								$('#translation-7').html('AKTIBOAK');
								$('#translation-8').html('AMAITUAK');
								$('#translation-9').html('PRESTATUAK');
								
								// Progress bar
								$('#translation-10').html('%<span class=\"progress-percentage\">0</span> BURUTUA');
								
								// New exercise tab
								$('#translation-13').html('ARIKETA BERRIA');
								$('#translation-14').find('input').attr('placeholder', 'Ariketa berriaren identifikadorea (ariketaren zenbakia, izena, etab.)');
								$('#translation-15').find('textarea').attr('placeholder', 'Enuntziatua');
								$('#translation-16').find('input').attr('placeholder', 'Gaia');
								$('#translation-17').find('input').attr('placeholder', 'Orrialdea');
								$('#translation-18').html('Sailtasuna: <span class="difficulty-level">5</span>');
								$('#translation-19').html('ARIKETA GORDE');
								$('#translation-20').html('GEHIAGO');
								
								// Languages of the profile
								$('select.language-select').empty();
								$('select.language-select').append('<option value="1">Gaztelania</option>');
								$('select.language-select').append('<option value="2">Euskera</option>');
								$('select.language-select').append('<option value="3">Ingelesa</option>');
								$('select.language-select').append('<option value="4">Frantsesa</option>');
								break;
							case 'en':
								// Profile 
								$('#translation-1').html('<span class=\"name\"></span>\'S PROFILE');
								$('#translation-2').html('GO TO CLASS');
								$('#translation-3').html('You are in <span class=\"subject\"></span> subject');
								$('#translation-4').html('SUBJECT');
								$('#translation-5').html('LANGUAGE');
								$('#translation-6').html('CLOSE SESSION');
								
								// State buttons
								$('#translation-7').html('ACTIVES');
								$('#translation-8').html('FINISHED');
								$('#translation-9').html('READY');
								
								// Progress bar
								$('#translation-10').html('<span class=\"progress-percentage\">0</span>% ACHIEVED');
								
								// New exercise tab
								$('#translation-13').html('NEW EXERCISE');
								$('#translation-14').find('input').attr('placeholder', 'Identifier of the new exercise (exercise number, name, etc.)');
								$('#translation-15').find('textarea').attr('placeholder', 'Statement');
								$('#translation-16').find('input').attr('placeholder', 'Topic');
								$('#translation-17').find('input').attr('placeholder', 'Page');
								$('#translation-18').html('Difficulty: <span class="difficulty-level">5</span>');
								$('#translation-19').html('SAVE EXERCISE');
								$('#translation-20').html('MORE');
								
								// Languages of the profile
								$('select.language-select').empty();
								$('select.language-select').append('<option value="1">Spanish</option>');
								$('select.language-select').append('<option value="2">Basque</option>');
								$('select.language-select').append('<option value="3">English</option>');
								$('select.language-select').append('<option value="4">French</option>');
								break;
							case 'fr':
								// Profile 
								$('#translation-1').html('PROFIL DE <span class=\"name\"></span>');
								$('#translation-2').html('ALLER À CLASSE');
								$('#translation-3').html('Vous êtes dans la matière de <span class=\"subject\"></span>');
								$('#translation-4').html('MATIÈRE');
								$('#translation-5').html('LANGUE');
								$('#translation-6').html('DÉCONNECTER');
								
								// State buttons
								$('#translation-7').html('ACTIFS');
								$('#translation-8').html('TERMINÉS');
								$('#translation-9').html('PRÈTS');
								
								// Progress bar
								$('#translation-10').html('<span class=\"progress-percentage\">0</span>% completé');
								
								// New exercise tab
								$('#translation-13').html('NOUVEAU EXERCICE');
								$('#translation-14').find('input').attr('placeholder', 'Identificateur du noueveau exercice (nombre d’exercice, nom, etc.)');
								$('#translation-15').find('textarea').attr('placeholder', 'Enoncé');
								$('#translation-16').find('input').attr('placeholder', 'Sujet');
								$('#translation-17').find('input').attr('placeholder', 'Page');
								$('#translation-18').html('Difficulté: <span class="difficulty-level">5</span>');
								$('#translation-19').html('GARDER L’EXERCICE');
								$('#translation-20').html('PLUS');
								
								// Languages of the profile
								$('select.language-select').empty();
								$('select.language-select').append('<option value="1">Castillan</option>');
								$('select.language-select').append('<option value="2">Basque</option>');
								$('select.language-select').append('<option value="3">Anglais</option>');
								$('select.language-select').append('<option value="4">François</option>');
								break;
						}
						if($('#main').hasClass('profile-main'))  {
							if(lang != '') {
								switch(lang) {
									case 'es':
										$('select.language-select').val('1').attr('selected', 'selected');
										break;
									case 'eu':
										$('select.language-select').val('2').attr('selected', 'selected');
										break;
									case 'en':
										$('select.language-select').val('3').attr('selected', 'selected');
										break;
									case 'fr':
										$('select.language-select').val('4').attr('selected', 'selected');
										break;
								}
							}
						}

						$('.name').attr('data-id', data.data[0].id);
						if(data.data[1].subject != null)
							$('.subject').html(data.data[1].subject);
						var surname1 = (data.data[6] !== undefined && data.data[5].surname1 !== undefined) ? data.data[6].surname1 : '';
						var surname2 = (data.data[7] !== undefined && data.data[6].surname2 !== undefined) ? data.data[7].surname2 : '';
						$('.name').html(data.data[5].username +
									   ((surname1 == undefined || surname1 == null || surname1 == '') ? '' : ' ' + surname1) +
									   ((surname2 == undefined || surname2 == null || surname2 == '') ? '' : ' ' + surname2)
										);
						$('select.subject-select').html('');
						$.each(data.data[8].subjects, function(i, item) {
							if(item.id == data.data[2].subject_id && item.group_id == data.data[4].group_id) {
								$('select.subject-select').append('<option value="' + i + '" data-id="' + item.id + '" data-groupid="' + item.group_id + '" data-group="' + item.group + '" selected>' + item.group + ':(' + item.acronym + ') ' + item.name + '</option>');
							} else {
								$('select.subject-select').append('<option value="' + i + '" data-id="' + item.id + '" data-groupid="' + item.group_id + '" data-group="' + item.group + '">' + item.group + ':(' + item.acronym + ') ' + item.name + '</option>');
							}
						});
						
						if(data.data[10].attendanceclass != null) {
							attendanceclass = data.data[10].attendanceclass;
						} else {
							$('.launch-exercise').addClass('disabled');
							$('.change-to-active').addClass('disabled');
							$('.change-to-finished').addClass('disabled');
						}
						
						if(!$('#main').hasClass('profile-main'))
							showExercises('Active');
					}
				}
			});
			return $.Deferred().resolve();
		 }
		
		function showExercises(type) {
			$.ajax({
				type: 'GET',
				url: domain + 'show-exercises.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Type: type },
				success: function(data) {
					$('#exercises-content').html('');
					$('#header').show();
					$('#state-buttons').show();
					var windowHeight = $(window).height();
					var offsetTop = $('#main').offset().top;
					var offsetBottom =  $('#overfooter').height() + $('#footer').height();
				
					$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4 * Math.floor(parseFloat($('body').css('font-size'))));
					$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
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
							$('#translation-11').html('Il y a un erreur en chargeant des exercices.');
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
							$('#translation-12').html('Il n’y a pas des exerciCes disponibles');
							break;
						}
					} else {
						if($('#container').find('#toast').length)
							$('#toast').remove();
						var statistics = (type == 'Finished') ? 'statistics-finished-button' : 'statistics-button';
						$.each(data.exercises, function(i, item) {
							$('#exercises-content').append(
							'<div class=\"exercise exercise-' + type.toLowerCase() +'\" data-id=\"' + item.exercise.id + '\">' +
								'<div class=\"exercise-container col-xs-12\">' +
									'<div class=\"col-xs-4 col-sm-6 col-md-9 col-lg-9 exercise-name\">' +
										'<div class=\"ellipsis padd1 bold\">' + item.exercise.description + '</div>' +
										'<div class=\"exercise-name-icons padd3\">' + ((type == 'Ready') ? '&nbsp;' : (item.exercise.nofinished + '/' + item.exercise.num + ' <i class=\"fa fa-check-square-o fa-fw\"></i> ' + item.exercise.noquestions + '/' + item.exercise.num + ' <i class=\"fa fa-exclamation fa-fw\"></i>')) + '</div>' +
									'</div>' +
									'<div class=\"col-xs-8 col-sm-6 col-md-3 col-lg-3 exercise-buttons\">' +
										'<div class=\"exercise-buttons-icons\"><div align=\"right\">' +
											((type == 'Ready') ? '<div class="col-xs-3"></div>' : ('<button class=\"btn btn-default btn-success col-xs-offset-1 col-xs-3 ' + statistics + '\"><i class=\"fa fa-bar-chart\"></i></button>')) +
											((type == 'Active') ? '' : ('<button class=\"btn btn-default btn-danger col-xs-offset-1 col-xs-3 change-to-active\"><i class=\"fa fa-paper-plane\"></i></button>')) +
											((type == 'Finished') ? '' : ('<button class=\"btn btn-default btn-primary col-xs-offset-1 col-xs-3 change-to-finished\"><i class=\"fa fa-flag-checkered\"></i></button>')) +
											((type == 'Ready') ? '' : ('<button class=\"btn btn-default btn-warning col-xs-offset-1 col-xs-3 change-to-ready\"><i class=\"fa fa-clock-o\"></i></button>')) +
										'</div></div>' +
									'</div>' +
								'</div>' +
							'</div>'
							);
						});
						if ($(window).width() <= 480) {
							$('.change-to-active').addClass('btn-xs');
							$('.change-to-finished').addClass('btn-xs');
							$('.change-to-ready').addClass('btn-xs');
							$('.statistics-finished-button').addClass('btn-xs');
							$('.statistics-button').addClass('btn-xs');
						}
						loadProgressBar();
					}
				}
			});
			return $.Deferred().resolve();
		}
		
		function launchExercise(state, description, statement, topic, page, difficulty) {
			$.ajax({
				type: 'GET',
				url: domain + 'launch-exercise.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { State : state, Description: description, Statement: statement, Topic: topic, Page: page, Difficulty: difficulty },
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
				url: domain + 'get-session-progress.php',
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
		
		function showStatistics(id, exercisename) {
			// Wait for everything to hide
			hideAll().done(function() {
				$.ajax({
					type: 'GET',
					url: domain + 'show-statistics.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { State: '%', Id: id, Key: '%' },
					success: function(data) {
						$('.darken').show();
						$('#container').append(
							'<div id=\"statistics\" data-id="' + id + '">' +
								'<div id=\"statistics-title\">' +
									'<div class=\"tab-title col-xs-2 col-lg-1\"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
									'<div class=\"tab-title col-xs-10 col-lg-11 ehuFontStyle\"><h4><i class=\"fa fa-bar-chart marginRight\"></i><span class="marginLeft">' + exercisename + '</span><span class="statistics-exercise-title"></span></h4></div>' +
								'</div>' +
								'<div class=\"clear\"></div>' +
								'<div class=\"separator\"></div>' +
								'<div class=\"statistics-body\">' +
									'<div id=\"statistics-buttons\">' +
										'<div class=\"col-xs-4 statistics-state-button statistics-state-button-selected\">' +
											'<button type=\"button\" id=\"statistics-all-button" class="btn btn-default btn-success active\">' +
												'<span id="translation-22" class="bold">TODOS</span>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4 statistics-state-button\">' +
											'<button type=\"button\" id=\"statistics-finished-button\" class=\"btn btn-default btn-success\">' +
												'<b><i class=\"fa fa-check-square-o fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-finished\"><span class=\"statistics-percentage statistics-percentage-finished\"></span></span></b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4 statistics-state-button\">' +
											'<button type=\"button\" id=\"statistics-question-button\" class=\"btn btn-default btn-success\">' +
												'<b><i class=\"fa fa-exclamation fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-question\"><span class=\"statistics-percentage statistics-percentage-question\"></span></span></b>' +
											'</button>' +
										'</div>' +
									'</div>' +
									'<div class=\"clear\"></div>' +
									'<div class=\"statistics-body-a statistics-body-all-selected\">' +
										'<div class=\"statistics-search form-group col-xs-12\">' +
											'<div id="translation-23" class=\"col-xs-8 col-sm-10 col-md-10 col-lg-11\"><input type=\"search\" id="search-student-input" class=\"form-control\"></div>' +
											'<div class=\"col-xs-4 col-sm-2 col-md-2 col-lg-1\"><button type=\"button\" id="search-student-button" class=\"btn btn-default btn-primary\"><i class=\"fa fa-search fa-fw\"></i></button></div>' +
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
						
						switch(lang) {
						case 'es':
							$('#translation-22').html('TODOS');
							$('#translation-23').find('input').attr('placeholder', 'Buscar alumno');
							break;
						case 'eu':
							$('#translation-22').html('GUZTIAK');
							$('#translation-23').find('input').attr('placeholder', 'Ikaslea bilatu');
							break;
						case 'en':
							$('#translation-22').html('ALL');
							$('#translation-23').find('input').attr('placeholder', 'Find student');
							break;
						case 'fr':
							$('#translation-22').html('TOUS');
							$('#translation-23').find('input').attr('placeholder', 'Chercher étudiant');
							break;
						}
						
						$('#header').show();
						$('#state-buttons').show();
						var windowHeight = $(window).height();
						var offsetTop = $('#main').offset().top;
						var offsetBottom =  $('#overfooter').height() + $('#footer').height();
						
						$('#statistics').css('bottom', offsetBottom);
						$('#statistics').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());

						$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top - 2*$('.statistics-search').height() - 2 * Math.floor(parseFloat($('body').css('font-size'))));
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
							url: domain + 'show-statistics-percentages.php',
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
					}
				});
			});
			return $.Deferred().resolve();
		}
		
		function showStatisticsFinished(id, exercisename) {
			// Wait for everything to hide
			hideAll().done(function() {
				$.ajax({
					type: 'GET',
					url: domain + 'show-statistics.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { State: '%', Id: id, Key: '%' },
					success: function(data) {
						$('.darken').show();
						$('#container').append(
							'<div id=\"statistics\" data-id="' + id + '" class=\"statistics-exercise-finished\">' +
								'<div id=\"statistics-title\">' +
									'<div class=\"tab-title col-xs-2 col-lg-1\"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
									'<div class=\"tab-title col-xs-10 col-lg-11 ehuFontStyle\"><h4><i class=\"fa fa-bar-chart marginRight\"></i><span class="marginLeft">' + exercisename + '</span><span class="statistics-exercise-title"></span></h4></div>' +
								'</div>' +
								'<div class=\"clear\"></div>' +
								'<div class=\"separator\"></div>' +
								'<div class=\"statistics-body\">' +
									'<div id=\"statistics-buttons\">' +
										'<div class=\"col-xs-4 statistics-state-button statistics-state-button-selected\">' +
											'<button type=\"button\" id=\"statistics-all-button" class="btn btn-default btn-success active\">' +
												'<span id="translation-22" class="bold">TODOS</span>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4 statistics-state-button\">' +
											'<button type=\"button\" id=\"statistics-finished-button\" class=\"btn btn-default btn-success\">' +
												'<b><i class=\"fa fa-check-square-o fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-finished\"><span class=\"statistics-percentage statistics-percentage-finished\"></span></span></b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4 statistics-state-button\">' +
											'<button type=\"button\" id=\"statistics-question-button\" class=\"btn btn-default btn-success\">' +
												'<b><i class=\"fa fa-exclamation fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-question\"><span class=\"statistics-percentage statistics-percentage-question\"></span></span></b>' +
											'</button>' +
										'</div>' +
									'</div>' +
									'<div class=\"clear\"></div>' +
									'<div class=\"statistics-body-a statistics-body-all-selected\">' +
										'<div class=\"statistics-search form-group col-xs-12\">' +
											'<div id="translation-23" class=\"col-xs-8 col-sm-10 col-md-10 col-lg-11\"><input type=\"search\" id="search-student-input" class=\"form-control\"></div>' +
											'<div class=\"col-xs-4 col-sm-2 col-md-2 col-lg-1\"><button type=\"button\" id="search-student-button" class=\"btn btn-default btn-primary\"><i class=\"fa fa-search fa-fw\"></i></button></div>' +
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
						
						switch(lang) {
						case 'es':
							$('#translation-22').html('TODOS');
							$('#translation-23').find('input').attr('placeholder', 'Buscar alumno');
							break;
						case 'eu':
							$('#translation-22').html('GUZTIAK');
							$('#translation-23').find('input').attr('placeholder', 'Ikaslea bilatu');
							break;
						case 'en':
							$('#translation-22').html('ALL');
							$('#translation-23').find('input').attr('placeholder', 'Find student');
							break;
						case 'fr':
							$('#translation-22').html('TOUS');
							$('#translation-23').find('input').attr('placeholder', 'Chercher étudiant');
							break;
						}
						
						$('#header').show();
						$('#state-buttons').show();
						var windowHeight = $(window).height();
						var offsetTop = $('#main').offset().top;
						var offsetBottom =  $('#overfooter').height() + $('#footer').height();
						
						$('#statistics').css('bottom', offsetBottom);
						$('#statistics').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());

						$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
						2 * $('.statistics-search').height() - 2 * Math.floor(parseFloat($('body').css('font-size'))));
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
							url: domain + 'show-statistics-percentages.php',
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
					}
				});
			});
			return $.Deferred().resolve();
		}
		
		function loadStatistics(state, id, key) {
			$.ajax({
				type: 'GET',
				url: domain + 'show-statistics.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { State: state, Id: id, Key: key },
				success: function(data) {
					$('.statistics-list-content').html('');
					$('#header').show();
					var windowHeight = $(window).height();
					var offsetTop = $('#main').offset().top;
					var offsetBottom =  $('#overfooter').height() + $('#footer').height();
					
					if(state == 'Question') {
						$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
						2 * $('.statistics-search').height() - $('.statistics-question-buttons').height() - 2 * Math.floor(parseFloat($('body').css('font-size'))));
					} else {
						$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
						2 * $('.statistics-search').height() - 2 * Math.floor(parseFloat($('body').css('font-size'))));
					}
					$('.statistics-list-content').css('height', $('.statistics-list-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
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
		
		function showExerciseDetails(id) {
			// Wait for everything to hide
			hideAll().done(function() {
				$.ajax({
					type: 'GET',
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
									'<div class=\"tab-title col-xs-6\" align=\"center\"><h4 class="exercise-detail-description">' + data.exercise.description + '</h4></div>' +
									'<div class=\"tab-title col-xs-3\"><i class=\"config-exercise fa fa-cogs pull-right btn ui-corner-all ui-btn-b btn-primary\"></i></div>' + 
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
		
		function changeExerciseType(id, to) {
			$.ajax({
				type: 'GET',
				url: domain + 'change-exercise.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Id: id, Type: to },
				success: function(data) {
					if(to == 'Finished')
						setTimeout(function() { assignClassToExercise(id) }, 10*1000);
					refresh();
					return $.Deferred().resolve();
				}
			});
		}
		
		function assignClassToExercise(id) {
			$.ajax({
				type: 'GET',
				url: domain + 'assign-class-to-exercise.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Id: id },
				success: function(data) {
				}
			});
		}
		
		function updateExercise(id, description, statement, topic, page, difficulty) {
			$.ajax({
				type: 'GET',
				url: domain + 'change-exercise.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Id: id, Description: description, Statement: statement, Topic: topic, Page: page, Difficulty: difficulty },
				success: function(data) {
					refresh();
				}
			});
			return $.Deferred().resolve();
		}
		
		function refresh() {
			if($('#state-buttons').find('.selected-active-button').length > 0) {
				showExercises('Active');
			} else if($('#state-buttons').find('.selected-finished-button').length > 0) {
				showExercises('Finished')
			} else if($('#state-buttons').find('.selected-ready-button').length > 0) {
				showExercises('Ready')
			}
			return $.Deferred().resolve();
		}
		
		function viewProfile() {	
			window.location.replace('profile.html');
		}
		
		function viewMain() {
			window.location.replace('teacher.html');
		}
		
		// ------------------------------------------------------------------------------------------------------------------
		// 												  MAIN CALL AND ACTION LISTENERS
		// ------------------------------------------------------------------------------------------------------------------
		
		// Call the main function to load content and then add the action listeners
		loadData().done(function() {
			$(document).on('vclick click tap', '.back', hideAll);
		
			$(document).on('click', '.statistics-button', function(e) {
				e.stopPropagation();
				// Get the id of the exercise from the field 'data-id' (needed here before the hideAll call to work)
				var id = $(this).parents('.exercise').attr('data-id');
				var exercisename = $(this).parents('.exercise').find('.exercise-name div').html();
				showStatistics(id, exercisename);
			});
			$(document).on('click', '.statistics-finished-button', function(e) {
				e.stopPropagation();
				// Get the id of the exercise from the field 'data-id' (needed here before the hideAll call to work)
				var id = $(this).parents('.exercise').attr('data-id');
				var exercisename = $(this).parents('.exercise').find('.exercise-name div').html();
				showStatisticsFinished(id, exercisename);
			});
			
			$(document).on('vclick click tap', '#actives-button', function() {
				$('#exercises-content').html("");
				showExercises('Active');
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
				showExercises('Finished');
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
				showExercises('Ready');
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
			
			$(document).on('vclick click tap', '.change-to-active', function(e) {
				e.stopPropagation();
				var id = $(this).parents('.exercise').attr('data-id');
				changeExerciseType(id, 'Active');
			});
			
			$(document).on('vclick click tap', '.change-to-finished', function(e) {
				e.stopPropagation();
				var id = $(this).parents('.exercise').attr('data-id');
				changeExerciseType(id, 'Finished');
			});
			
			$(document).on('vclick click tap', '.change-to-ready', function(e) {
				e.stopPropagation();
				var id = $(this).parents('.exercise').attr('data-id');
				changeExerciseType(id, 'Ready');
			});
			
			$(document).on('vclick click tap', '#statistics-all-button', function() {
				$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
						2 * $('.statistics-search').height() - 2 * Math.floor(parseFloat($('body').css('font-size'))));
				if($('#statistics-finished-button').hasClass('active')) {
					$('#statistics-finished-button').removeClass('active');
					$('#statistics-finished-button').parent().removeClass('statistics-state-button-selected');
					$('.statistics-body-a').removeClass('statistics-body-finished-selected');
				} else if($('#statistics-question-button').hasClass('active')) {		
					$('#statistics-question-button').removeClass('active');
					$('#statistics-question-button').parent().removeClass('statistics-state-button-selected');
					$('.statistics-body-a').removeClass('statistics-body-question-selected');
				}
				$('.statistics-question-buttons').remove();
				$('#statistics-all-button').addClass('active');
				var id = $(this).parents('#statistics').attr('data-id');
				$('.statistics-body-a').addClass('statistics-body-all-selected');
				$('#statistics-all-button').parent().addClass('statistics-state-button-selected');
				loadStatistics('%', id, '%');
			});
			
			$(document).on('vclick click tap', '#statistics-finished-button', function() {
				$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
						2 * $('.statistics-search').height() - 2 * Math.floor(parseFloat($('body').css('font-size'))));
				if($('#statistics-all-button').hasClass('active')) {
					$('#statistics-all-button').removeClass('active');
					$('#statistics-all-button').parent().removeClass('statistics-state-button-selected');
					$('.statistics-body-a').removeClass('statistics-body-all-selected');
				} else if($('#statistics-question-button').hasClass('active')) {		
					$('#statistics-question-button').removeClass('active');
					$('#statistics-question-button').parent().removeClass('statistics-state-button-selected');
					$('.statistics-body-a').removeClass('statistics-body-question-selected');
				}
				$('.statistics-question-buttons').remove();
				$('#statistics-finished-button').addClass('active');
				var id = $(this).parents('#statistics').attr('data-id');
				$('.statistics-body-a').addClass('statistics-body-finished-selected');
				$('#statistics-finished-button').parent().addClass('statistics-state-button-selected');
				loadStatistics('Finished', id, '%');
			});
			
			$(document).on('vclick click tap', '#statistics-question-button', function() {
				if($('#statistics-all-button').hasClass('active')) {
					$('#statistics-all-button').removeClass('active');
					$('#statistics-all-button').parent().removeClass('statistics-state-button-selected');
					$('.statistics-body-a').removeClass('statistics-body-all-selected');
				} else if($('#statistics-finished-button').hasClass('active')) {		
					$('#statistics-finished-button').removeClass('active');
					$('#statistics-finished-button').parent().removeClass('statistics-state-button-selected');
					$('.statistics-body-a').removeClass('statistics-body-finished-selected');
				}
				$('.statistics-question-buttons').remove();
				$('#statistics-question-button').addClass('active');
				var id = $(this).parents('#statistics').attr('data-id');
				$('.statistics-body-a').addClass('statistics-body-question-selected');
				$('#statistics-question-button').parent().addClass('statistics-state-button-selected');
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
			
			$(document).on('vclick click tap', '#statistics-question-button', function() {	
				if($(this).parents('.statistics-exercise-finished').length) {
					$('.statistics-body-a').prepend(
						'<div class="statistics-question-buttons">' +
							'<div class=\"col-xs-4\">' +
								'<button type=\"button\" class="btn btn-default btn-info active btn-xs statistics-questions-show-all\">' +
									'<span id="translation-24" class="bold"></span>' +
								'</button>' +
							'</div>' +
							'<div class=\"col-xs-4\">' +
								'<button type=\"button\" class=\"btn btn-default btn-info btn-xs statistics-questions-show-solved\">' +
										'<span id="translation-25" class="bold"></span>' +
								'</button>' +
							'</div>' +
							'<div class=\"col-xs-4\">' +
								'<button type=\"button\" class=\"btn btn-default btn-info btn-xs statistics-questions-show-notsolved\">' +
										'<span id="translation-26" class="bold"></span>' +
								'</button>' +
							'</div>' +
						'</div>' +
						'<div class="clear"></div>' +
						'<div class="smallMargin"></div>'
					);
					switch(lang) {
						case 'es':
							$('#translation-24').html('TODAS');
							$('#translation-25').html('RESUELTAS');
							$('#translation-26').html('SIN RESOLVER');
							break;
						case 'eu':
							$('#translation-24').html('GUZTIAK');
							$('#translation-25').html('ARGITUAK');
							$('#translation-26').html('ARGITU GABE');
							break;
						case 'en':
							$('#translation-24').html('ALL');
							$('#translation-25').html('SOLVED');
							$('#translation-26').html('NOT SOLVED');
							break;
						case 'fr':
							$('#translation-24').html('TOUTES');
							$('#translation-25').html('RÉSOLUES');
							$('#translation-26').html('SANS RÉSOUDRE');
							break;
					}
				}
				$('.statistics-list-container').html();
				$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
				2 * $('.statistics-search').height() - $('.statistics-question-buttons').height() - 2 * Math.floor(parseFloat($('body').css('font-size'))));
			});
			
			$(document).on('vclick click tap', '.statistics-questions-show-all', function() {
				var id = $(this).parents('#statistics').attr('data-id');
				var key = $('#search-student-input').val();
				showStatisticsForQuestions(id, 'All', '%' + key + '%');
			});
			
			$(document).on('vclick click tap', '.statistics-questions-show-solved', function() {
				var id = $(this).parents('#statistics').attr('data-id');
				var key = $('#search-student-input').val();
				showStatisticsForQuestions(id, 'Solved', '%' + key + '%');
			});
			
			$(document).on('vclick click tap', '.statistics-questions-show-notsolved', function() {
				var id = $(this).parents('#statistics').attr('data-id');
				var key = $('#search-student-input').val();
				showStatisticsForQuestions(id, 'NotSolved', '%' + key + '%');
			});
			
			function showStatisticsForQuestions(id, type, key) {
				$('.statistics-list-content').html('');
				$.ajax({
					type: 'GET',
					url: domain + 'show-statistics-question.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { Id: id, Question_State: type, Key: key },
					success: function(data) {
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
			}
			
			$(document).on('vclick click tap', '.launch-exercise', function() {
				var description = $(this).parents('#new-exercise').find('input#input-exercise-id').val();
				if(description.length < 1) {
					if($('#toast-new-exercise').length)
						$('#toast-new-exercise').remove();
					$('#container').append('<div id="toast-new-exercise" class="error3"><div id="toast-content-ne"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-33">&nbsp;</span></div></div>');
					switch(lang) {
						case 'es':
							$('#translation-33').html('La descripción debe tener por lo menos un carácter.');
							break;
						case 'eu':
							$('#translation-33').html('Deskripzioa, gutxienez, karaktere bat izan behar du.');
							break;
						case 'en':
							$('#translation-33').html('The description must have, at least, one character.');
							break;
						case 'fr':
							$('#translation-33').html('La description doit avoir au moins un caractère.');
							break;
					}
					$('#toast-new-exercise').hide().fadeIn('slow').delay(2000).fadeOut();
				} else {
					// Advanced new exercise creation tab displayed
					if($('#new-exercise').find('.advanced-exercise-occult').length != 0) {
						var statement  = $(this).parents('#new-exercise').find('textarea#input-exercise-statement').val();
						var topic = $(this).parents('#new-exercise').find('input#input-exercise-topic').val();
						var page = $(this).parents('#new-exercise').find('input#input-exercise-page').val();
						var difficulty = $(this).parents('#new-exercise').find('.difficulty-level').html();
					} else {
						var statement = '';
						var topic = '';
						var page = '';
						var difficulty = '';
					}
					launchExercise('Active', description, statement, topic, page, difficulty);
				}
			});
			
			$(document).on('vclick click tap', '.save-exercise', function() {
				var description = $(this).parents('#new-exercise').find('input#input-exercise-id').val();
				// Advanced new exercise creation tab displayed
				if(description.length < 1) {
					if($('#toast-new-exercise').length)
						$('#toast-new-exercise').remove();
					$('#container').append('<div id="toast-new-exercise" class="error3"><div id="toast-content-ne"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-33">&nbsp;</span></div></div>');
					switch(lang) {
						case 'es':
							$('#translation-33').html('La descripción debe tener por lo menos un carácter.');
							break;
						case 'eu':
							$('#translation-33').html('Deskripzioa, gutxienez, karaktere bat izan behar du.');
							break;
						case 'en':
							$('#translation-33').html('The description must have, at least, one character.');
							break;
						case 'fr':
							$('#translation-33').html('La description doit avoir au moins un caractère.');
							break;
					}
					$('#toast-new-exercise').hide().fadeIn('slow').delay(2000).fadeOut();
				} else {
					if($('#new-exercise').find('.advanced-exercise-occult').length != 0) {
						var statement  = $(this).parents('#new-exercise').find('textarea#input-exercise-statement').val();
						var topic = $(this).parents('#new-exercise').find('input#input-exercise-topic').val();
						var page = $(this).parents('#new-exercise').find('input#input-exercise-page').val();
						var difficulty = $(this).parents('#new-exercise').find('.difficulty-level').html();
					} else {
						var statement = '';
						var topic = '';
						var page = '';
						var difficulty = '';
					}
					launchExercise('Ready', description, statement, topic, page, difficulty);
				}
			});
			
			$(document).on('vclick click tap', '.config-exercise', function() {
				if(!$(this).parents('#exercise-details').find('.exercise-detail-statement').find('textarea').length) {
					$('#toast-details').remove();
					
					for(var i = 1; i < 5; ++i)
						$('.exercise-details-title-' + i).show();
					$('.exercise-detail-statement').show();
					$('.exercise-detail-topic').show();
					$('.exercise-detail-page').show();
					$('.exercise-detail-difficulty').show();
					
					// FIND PREVIOUS VALUES (IF THERE EXIST)
					var description = '';
					if($(this).parents('#exercise-details').find('.exercise-detail-description').length)
						description = $(this).parents('#exercise-details').find('.exercise-detail-description').html();
					var statement = '';
					if($(this).parents('#exercise-details').find('.exercise-detail-statement').length)
						statement = $(this).parents('#exercise-details').find('.exercise-detail-statement').html();
					var topic = '';
					if($(this).parents('#exercise-details').find('.exercise-detail-topic').length)
						topic = $(this).parents('#exercise-details').find('.exercise-detail-topic').html();
					var page = '';
					if($(this).parents('#exercise-details').find('.exercise-detail-page').length)
						page = $(this).parents('#exercise-details').find('.exercise-detail-page').html();	
					var difficulty = '';
					if($(this).parents('#exercise-details').find('.exercise-detail-difficulty').length)
						difficulty = $(this).parents('#exercise-details').find('.exercise-detail-difficulty').html();


					$(this).parents('#exercise-details').find('.exercise-detail-description').html('<input type=\"text\" class=\"form-control\" id="input-exercise-description" placeholder=\"Descripción\" value="' + description + '">');		
					$(this).parents('#exercise-details').find('.exercise-detail-statement').html('<textarea class=\"form-control\" id="input-exercise-statement" placeholder=\"Enunciado\" rows="3">' + statement + '</textarea>');
					$(this).parents('#exercise-details').find('.exercise-detail-topic').html('<input type=\"text\" class=\"form-control\" id="input-exercise-topic" placeholder=\"Tema\" value="' + topic + '">');
					$(this).parents('#exercise-details').find('.exercise-detail-page').html('<input type=\"text\" class=\"form-control\" id="input-exercise-page" placeholder=\"Página\" value="' + page + '">');
					$(this).parents('#exercise-details').find('.exercise-detail-difficulty').html('<input type="number" id="input-exercise-difficulty" class="difficulty-slider col-xs-12" min="1" max="10" value="' + difficulty + '">');

					$('.exercise-details-content').append(
						'<button type="button" class="btn btn-default btn-primary save-changes">' +
							'<div class="bold"><span id="translation-31">&nbsp;</span></div>' +
						'</button>'
					);
					switch(lang) {
						case 'es':
							$('#translation-31').html('GUARDAR CAMBIOS');
							break;
						case 'eu':
							$('#translation-31').html('ALDAKETAK GORDE');
							break;
						case 'en':
							$('#translation-31').html('SAVE CHANGES');
							break;
						case 'fr':
							$('#translation-31').html('GARDER LES CHANGEMENTS');
							break;
					}
					var windowHeight = $(window).height();
					var offsetTop = $('#main').offset().top;
					var offsetBottom =  $('#overfooter').height() + $('#footer').height();	
				
					$('#exercise-details').css('bottom', offsetBottom);
					$('#exercise-details').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
					$('.exercise-details-body').css('height', $('#exercise-details').height() - 2 * $('.exercise-details-title').height() - Math.floor(parseFloat($('body').css('font-size'))));
					$('.exercise-details-content').css('height', $('.exercise-details-body').height() - 1);
				} else {
					var description = $(this).parents('#exercise-details').find('#input-exercise-description').val();
					var statement  = $(this).parents('#exercise-details').find('#input-exercise-statement').val();
					var topic = $(this).parents('#exercise-details').find('#input-exercise-topic').val();
					var page = $(this).parents('#exercise-details').find('#input-exercise-page').val();
					var difficulty = $(this).parents('#exercise-details').find('#input-exercise-difficulty').val();

					if(description.length < 1) {
					if($('#toast-new-exercise').length)
						$('#toast-new-exercise').remove();
						$('#container').append('<div id="toast-new-exercise" class="error3"><div id="toast-content-ne"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-33">&nbsp;</span></div></div>');
						switch(lang) {
							case 'es':
								$('#translation-33').html('La descripción debe tener por lo menos un carácter.');
								break;
							case 'eu':
								$('#translation-33').html('Deskripzioa, gutxienez, karaktere bat izan behar du.');
								break;
							case 'en':
								$('#translation-33').html('The description must have, at least, one character.');
								break;
							case 'fr':
								$('#translation-33').html('La description doit avoir au moins un caractère.');
								break;
						}
						$('#toast-new-exercise').hide().fadeIn('slow').delay(2000).fadeOut();
					} else {
						$(this).parents('#exercise-details').find('.exercise-detail-description').html(description);
						$(this).parents('#exercise-details').find('.exercise-detail-statement').html(statement);
						$(this).parents('#exercise-details').find('.exercise-detail-topic').html(topic);
						$(this).parents('#exercise-details').find('.exercise-detail-page').html(page);
						$(this).parents('#exercise-details').find('.exercise-detail-difficulty').html(difficulty);
			
						var something = 0;
						
						if(statement == null || statement == '') {
							$('.exercise-details-title-1').hide();
							$('.exercise-detail-statement').hide();
						} else something++;
						
						if(topic == null || topic == '') {
							$('.exercise-details-title-2').hide();
							$('.exercise-detail-topic').hide();
						} else something++;
						
						if(page == null || page == '') {
							$('.exercise-details-title-3').hide();
							$('.exercise-detail-page').hide();
						} else something++;
						
						if(difficulty == null || difficulty == '') {
							$('.exercise-details-title-4').hide();
							$('.exercise-detail-difficulty').hide();
						} else something++;
						
						$('.save-changes').remove();
						
						if(something == 0) {
							$('.exercise-details-content').append('<div id="toast-details"><div id="toast-content"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-32">&nbsp;</span></div></div>');
							$('#toast-details').hide().fadeIn('slow');
							switch(lang) {
							case 'es':
								$('#translation-32').html('No hay ningún detalle asociado a este ejercicio.');
								break;
							case 'eu':
								$('#translation-32').html('Ez dago xehetasunik ariketa honekin erlazionatuta.');
								break;
							case 'en':
								$('#translation-32').html('No details associated to this exercise.');
								break;
							case 'fr':
								$('#translation-32').html('Il n’y a pas des détails associés à cet exercice.');
								break;
							}
						}
					}
				}
			});
			
			$(document).on('vclick click tap', '.save-changes', function() {
				var id = $(this).parents('#exercise-details').attr('data-id');
				var description = $(this).parents('#exercise-details').find('#input-exercise-description').val();
				var statement  = $(this).parents('#exercise-details').find('#input-exercise-statement').val();
				var topic = $(this).parents('#exercise-details').find('#input-exercise-topic').val();
				var page = $(this).parents('#exercise-details').find('#input-exercise-page').val();
				var difficulty = $(this).parents('#exercise-details').find('#input-exercise-difficulty').val();
				if(description.length < 1) {
					if($('#toast-new-exercise').length)
						$('#toast-new-exercise').remove();
					$('#container').append('<div id="toast-new-exercise" class="error3"><div id="toast-content-ne"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-33">&nbsp;</span></div></div>');
					switch(lang) {
						case 'es':
							$('#translation-33').html('La descripción debe tener por lo menos un carácter.');
							break;
						case 'eu':
							$('#translation-33').html('Deskripzioa, gutxienez, karaktere bat izan behar du.');
							break;
						case 'en':
							$('#translation-33').html('The description must have, at least, one character.');
							break;
						case 'fr':
							$('#translation-33').html('La description doit avoir au moins un caractre.');
							break;
					}
					$('#toast-new-exercise').hide().fadeIn('slow').delay(2000).fadeOut();
				} else {
					parent = $(this).parents('#exercise-details');

					updateExercise(id, description, statement, topic, page, difficulty).done(function() {
						parent.find('.exercise-detail-description').html(description);
						parent.find('.exercise-detail-statement').html(statement);
						parent.find('.exercise-detail-topic').html(topic);
						parent.find('.exercise-detail-page').html(page);
						parent.find('.exercise-detail-difficulty').html(difficulty);
						
						var something = 0;
						
						if(statement == null || statement == '') {
							$('.exercise-details-title-1').hide();
							$('.exercise-detail-statement').hide();
						} else something++;
						
						if(topic == null || topic == '') {
							$('.exercise-details-title-2').hide();
							$('.exercise-detail-topic').hide();
						} else something++;
						
						if(page == null || page == '') {
							$('.exercise-details-title-3').hide();
							$('.exercise-detail-page').hide();
						} else something++;
						
						if(difficulty == null || difficulty == '') {
							$('.exercise-details-title-4').hide();
							$('.exercise-detail-difficulty').hide();
						} else something++;
									
						$('.save-changes').remove();
						
						if(something == 0) {
							$('.exercise-details-content').append('<div id="toast-details"><div id="toast-content"><i class="fa fa-exclamation-triangle fa-fw"></i> <span id="translation-32">&nbsp;</span></div></div>');
							$('#toast-details').hide().fadeIn('slow');
							switch(lang) {
							case 'es':
								$('#translation-32').html('No hay ningún detalle asociado a este ejercicio.');
								break;
							case 'eu':
								$('#translation-32').html('Ez dago xehetasunik ariketa honekin erlazionatuta.');
								break;
							case 'en':
								$('#translation-32').html('No details associated to this exercise.');
								break;
							case 'fr':
								$('#translation-32').html('Il n’y a pas des détails associés à cet exercice.');
								break;
							}
						}	
					});
				}
			});
			
			$(document).on('vclick click tap', '.advanced-exercise', function() {
				$('.advanced-exercise').html('<span class="bold" id="translation-21">&nbsp;</span>');
				switch(lang) {
					case 'es':
						$('#translation-21').html('MENOS');
						break;
					case 'eu':
						$('#translation-21').html('GUTXIAGO');
						break;
					case 'en':
						$('#translation-21').html('LESS');
						break;
					case 'fr':
						$('#translation-21').html('MOINS');
						break;
				}
				$('.advanced-exercise').addClass('advanced-exercise-occult');
				$('.advanced-exercise-occult').removeClass('advanced-exercise');
				
				var windowHeight = $(window).height();
				var offsetTop = $('#main').offset().top;
				var offsetBottom =  $('#overfooter').height() + $('#footer').height();	
				
				$('#new-exercise').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
				$('#new-exercise').css('bottom', offsetBottom);	
				$('.campos').css('height', windowHeight - offsetBottom - $('.campos').offset().top);
				$('.advanced-container').css('height', $('.campos').height() - 3 * $('.save-exercise').height() - $('#input-exercise-id').height()); 
				$('.advanced-content').css('height', $('.campos').height() - 3 * $('.save-exercise').height() - $('#input-exercise-id').height()); 
				$('.advanced-container').slideDown('slow');
			});
			
			$(document).on('vclick click tap', '.advanced-exercise-occult', function() {
				$('.advanced-exercise-occult').html('<span id="translation-20">&nbsp;</span>');
				switch(lang) {
					case 'es':
						$('#translation-20').html('MÁS');
						break;
					case 'eu':
						$('#translation-20').html('GEHIAGO');
						break;
					case 'en':
						$('#translation-20').html('MORE');
						break;
					case 'fr':
						$('#translation-20').html('PLUS');
						break;
				}
				$('.advanced-exercise-occult').addClass('advanced-exercise');
				$('.advanced-exercise').removeClass('advanced-exercise-occult');
				
				var windowHeight = $(window).height();
				var offsetTop = $('#main').offset().top;
				var offsetBottom =  $('#overfooter').height() + $('#footer').height();	
				
				hideAdvanced().done(function() {			
					$('.advanced-container').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
					$('.advanced-content').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
					$('#new-exercise').css('bottom', offsetBottom);
					$('#new-exercise').css('height', '');
				});
				
			});
			
			function hideAdvanced() {
				$('.advanced-container').slideUp('slow');
				setTimeout(function() {
					$('.campos').animate({'height': $('#input-exercise-id').height() + 5*Math.floor(parseFloat($('body').css('font-size'))) + $('.save-exercise').height()}, 500);
				}, 250);
				return $.Deferred().resolve();
			}
			
			$(document).on('vclick click tap', '.userName', function() {
				viewProfile();
			});	
			
			$(document).on('vclick click tap', '.profile-back', function() {
				 viewMain();	
			});
			
			$(document).on('vclick click tap', '.exercise', function(e) {
				e.stopPropagation();
				var id = $(this).attr('data-id');
				showExerciseDetails(id);	
			});
			
			$('select.subject-select').on('change', function (e) {
				var optionSelected = $('option:selected', this);
				var valueSelected = this.value;
				var text = optionSelected.text();
				$.ajax({
					type: 'GET',
					url: domain + 'change-subject.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { Subject: text.substr(text.indexOf(' ') + 1), Id: optionSelected.attr('data-id'), Group_id: optionSelected.attr('data-groupid'), Group: optionSelected.attr('data-group') },
					success: function() {
						$('.subject').html(text.substr(text.indexOf(' ') + 1));
					}
				});
			});
			
			$('select.language-select').on('change', function (e) {
				var optionSelected = $('option:selected', this);
				var valueSelected = this.value;
				var val = optionSelected.val();
				switch(val) {
					case '1':
						lang = 'es';
						break;
					case '2':
						lang = 'eu';
						break;
					case '3':
						lang = 'en';
						break;
					case '4':
						lang = 'fr';
						break;
				}

				$.ajax({
					type: 'GET',
					url: domain + 'change-lang.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { Language: lang },
					success: function(data) {
						loadData();
					}
				});
			});
			
			$('.profile-logout').on('click', logout);
			
			function logout() {
				$.ajax({
					type: 'GET',
					url: domain + 'end-session.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					success: function(data) {
						if(data.next == undefined)
							logout();
						else
							window.location.replace(data.next);
					}
				});
			}
			
			$(window).on('resize', function() {
				$('#header').show();
				$('#state-buttons').show();
				var windowHeight = $(window).height();
				var offsetTop = $('#main').offset().top;
				var offsetBottom =  $('#overfooter').height() + $('#footer').height();

				if($('#main').hasClass('profile-main')) {
					$('#main').css('height', windowHeight - offsetTop);
					$('#main').css('bottom', Math.floor(parseFloat($('body').css('font-size'))));
					$('#main-content').css('height', windowHeight - offsetTop - Math.floor(parseFloat($('body').css('font-size'))));
				}

				// DYNAMIC RESIZINGS
				$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
				$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
				
				$('.darken').css('height', windowHeight);
				$('.darken').css('bottom', windowHeight - $('#overfooter').offset().top);
				$('#new-exercise').css('bottom', offsetBottom);

				$('#statistics').css('bottom', offsetBottom);
				$('#statistics').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
				
				if ($(window).width() <= 480) {
					$('.change-to-active').addClass('btn-xs');
					$('.change-to-finished').addClass('btn-xs');
					$('.change-to-ready').addClass('btn-xs');
					$('.statistics-finished-button').addClass('btn-xs');
					$('.statistics-button').addClass('btn-xs');
				} else {
					$('.change-to-active').removeClass('btn-xs');
					$('.change-to-finished').removeClass('btn-xs');
					$('.change-to-ready').removeClass('btn-xs');
					$('.statistics-finished-button').removeClass('btn-xs');
					$('.statistics-button').removeClass('btn-xs');
				}

				if($('#statistics').length != 0) {
					$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
					2*$('.statistics-search').height() - Math.floor(parseFloat($('body').css('font-size'))));
					$('.statistics-list-content').css('height', $('.statistics-list-container').height() - Math.floor(parseFloat($('body').css('font-size'))));
				}
				
				if($('#exercise-details').length != 0) {
					$('#exercise-details').css('bottom', offsetBottom);
					$('#exercise-details').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
					$('.exercise-details-body').css('height', $('#exercise-details').height() - 2 * $('.exercise-details-title').height() - Math.floor(parseFloat($('body').css('font-size'))));
					$('.exercise-details-content').css('height', $('.exercise-details-body').height() - 1);
				}

				// Advanced new exercise creation tab displayed
				if($('#new-exercise').find('.advanced-exercise-occult').length != 0) {
					$('#new-exercise').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
					$('#new-exercise').css('bottom', offsetBottom);	
					$('.campos').css('height', windowHeight - offsetBottom - $('.campos').offset().top);
					$('.advanced-container').css('height', $('.campos').height() - 3 * $('.save-exercise').height() - $('#input-exercise-id').height()); 
					$('.advanced-content').css('height', $('.campos').height() - 3 * $('.save-exercise').height() - $('#input-exercise-id').height()); 
				// Naive new exercise creation tab displayed
				} else if($('#new-exercise').find('.advanced-exercise-occult').length == 0) {
					$('.campos').css('height', $('#input-exercise-id').height() + 5*Math.floor(parseFloat($('body').css('font-size'))) + $('.save-exercise').height());
					$('.advanced-container').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
					$('.advanced-content').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
					$('#new-exercise').css('bottom', offsetBottom);
					$('#new-exercise').css('height', '');
				}
			});
		});
		
		setInterval(refresh, 3000);
	});
});

