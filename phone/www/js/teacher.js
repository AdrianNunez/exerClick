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
				'<div class="new-exercise-title">' +
					'<div class=\"tab-title col-xs-3"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
					'<div class=\"tab-title col-xs-6\" align=\"center\"><h4>NUEVO EJERCICIO</h4></div>' +
					'<div class=\"tab-title col-xs-3\"><i class=\"launch-exercise fa fa-paper-plane pull-right btn ui-corner-all ui-btn-b btn-danger\"></i></div>' + 
				'</div>' +
				'<div class=\"clear\"></div>' +
				'<div class=\"row separator\"></div>' +
				'<form class=\"campos\"> ' +
					'<div class=\"col-xs-12\"><input type=\"text\" class=\"form-control\" id="input-exercise-id" placeholder=\"Identificador del nuevo ejercicio (número de ejercicio, nombre, etc.)\"></div>' +
					'<div class=\"clear\"></div>' +
					'<div class=\"advanced-container\"><div class=\"advanced-content\"></div></div>' +
					'<div class=\"clear\"></div>' +
					'<div class=\"extraMargin\"></div>' +
					'<div class="new-exercise-buttons">' +
						'<div class="col-xs-6"><button type="button" class="btn btn-default btn-warning save-exercise">' +
							'<span class="badge left"><i class="fa fa-exclamation-triangle fa-fw"></i></span><div class="visible-sm visible-md visible-lg bold">GUARDAR EJERCICIO</div>' +
						'</button></div>' +
						'<div class="col-xs-6"><button type="button" class="btn btn-default btn-primary advanced-exercise">' +
							'AVANZADO' +
						'</button></div>' +
					'</div>' +
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
			'<div class=\"col-xs-12 bottompadd toppadd\"><textarea class=\"form-control\" id="input-exercise-statement" placeholder=\"Enunciado\" rows="5"></textarea></div>' +
			'<div class=\"clear\"></div>' +
			'<div class=\"col-xs-12 bottompadd\"><input type=\"text\" class=\"form-control\" id="input-exercise-topic" placeholder=\"Tema\"></div>' +
			'<div class=\"clear\"></div>' +
			'<div class=\"col-xs-12 bottompadd\"><input type=\"text\" class=\"form-control\" id="input-exercise-page" placeholder=\"Página\"></div>' +
			'<div class=\"clear\"></div>' +
			'<div class=\"difficulty col-xs-12 bottompadd\">' +
				'<input type="text" class="difficulty-slider" value="" data-slider-min="0" data-slider-max="10" data-slider-step="1" data-slider-value="5" ' +
				'data-slider-orientation="horizontal" data-slider-selection="after"data-slider-tooltip="hide">' +
			'</div>' +
			'<div class=\"col-xs-12\">Dificultad: <span class="difficulty-level">5</span></div>'
		);
		$('.advanced-container').show();
		$('.campos').css('height', $('#input-exercise-id').height() + 5*Math.floor(parseFloat($('body').css('font-size'))) + $('.save-exercise').height());
		$('.advanced-container').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
		$('.advanced-content').css('height', $('.campos').height() - $('.save-exercise').height() - $('#input-exercise-id').height()); 
		$('.difficulty-slider').css('width', $('.difficulty-slider').parent('.difficulty').siblings().width());
		$('.difficulty-slider').slider().on('slide', function(ev){
			$('.difficulty-level').html($('.difficulty-slider').val());
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
				async: false,
				url: 'http://exerclick-api.net46.net/get-data.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				success: function(data) {
					var lang = data.data[9].language;
					switch(lang) {
						case 'es':
							// Profile 
							$('#translation-1').html('PERFIL DE <span class=\"name\"></span>');
							$('#translation-2').html('Asignatura');
							$('#translation-3').html('Idioma');
							$('#translation-4').html('Estás en la asignatura de <span class="subject"></span>');
							$('#translation-5').html('CERRAR SESIÓN');
							break;
						case 'eu':
							// Profile 
							$('#translation-1').html('<span class=\"name\"></span>-REN PROFILA');
							$('#translation-2').html('Irakasgaia');
							$('#translation-3').html('Hizkuntza');
							$('#translation-4').html('<span class=\"subject\"></span> irakasgaian zaude');
							$('#translation-5').html('ITXI SAIOA');
							break;
					}
					
					$('.name').attr('data-id', data.data[0].id);
					if(data.data[1].subject != null)
						$('.subject').html(data.data[1].subject);
					var surname1 = (data.data[6] !== undefined && data.data[5].surname1 !== undefined) ? data.data[6].surname1 : '&nbsp;';
					var surname2 = (data.data[7] !== undefined && data.data[6].surname2 !== undefined) ? data.data[7].surname2 : '&nbsp;';
					$('.name').html(data.data[5].username + ' ' + surname1 + ' ' + surname2);
					$('select.subject-select').html('');
					$.each(data.data[8].subjects, function(i, item) {
						if(item.id == data.data[2].subject_id && item.group_id == data.data[4].group_id) {
							$('select.subject-select').append('<option value="' + i + '" data-id="' + item.id + '" data-groupid="' + item.group_id + '" data-group="' + item.group + '" selected>' + item.group + ':(' + item.acronym + ') ' + item.name + '</option>');
						} else {
							$('select.subject-select').append('<option value="' + i + '" data-id="' + item.id + '" data-groupid="' + item.group_id + '" data-group="' + item.group + '">' + item.group + ':(' + item.acronym + ') ' + item.name + '</option>');
						}
					});
					
					showExercises('Active');
				}
			});
			return $.Deferred().resolve();
		 }
		
		function showExercises(type) {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/show-exercises.php',
				jsonpCallback: 'jsonCallback',
				contentType: "application/json",
				dataType: 'jsonp',
				data: { Type: type },
				success: function(data) {
					$('#exercises-content').html("");var windowHeight = $(window).height();

					$('#exercises-container').css('height', windowHeight -  offsetTop  - offsetBottom - $('#overfooter').height() - 4*Math.floor(parseFloat($('body').css('font-size'))));
					$('#exercises-content').css('height', $('#exercises-container').height() - Math.floor(parseFloat($('body').css('font-size'))));	
					if(data.exercises.length == 0) {
						$('#exercises-content').html('No hay ejercicios disponibles.');
					}
					var statistics = (type == 'Finished') ? 'statistics-finished-button' : 'statistics-button';
					$.each(data.exercises, function(i, item) {
						$('#exercises-content').append(
						'<div class=\"exercise exercise-' + type.toLowerCase() +'\" data-id=\"' + item.exercise.id + '\">' +
							'<div class=\"exercise-container col-xs-12\">' +
								'<div class=\"col-xs-4 col-sm-6 col-md-9 col-lg-9 exercise-name\">' +
									'<div class=\"ellipsis padd1 bold\">' + item.exercise.description + '</div>' +
									'<div class=\"exercise-name-icons padd3\">' + item.exercise.nofinished + '/' + item.exercise.num + ' <i class=\"fa fa-check-square-o fa-fw\"></i> ' + item.exercise.noquestions + '/' + item.exercise.num + ' <i class=\"fa fa-exclamation fa-fw\"></i></div>' +
								'</div>' +
								'<div class=\"col-xs-8 col-sm-6 col-md-3 col-lg-3 exercise-buttons\">' +
									'<div class=\"exercise-buttons-icons\"><div align=\"right\">' +
										((type == 'Active') ? '' : ('<button class=\"btn btn-default btn-danger col-xs-offset-1 col-xs-3 change-to-active\"><i class=\"fa fa-paper-plane\"></i></button>')) +
										((type == 'Finished') ? '' : ('<button class=\"btn btn-default btn-primary col-xs-offset-1 col-xs-3 change-to-finished\"><i class=\"fa fa-flag\"></i></button>')) +
										((type == 'Ready') ? '' : ('<button class=\"btn btn-default btn-warning col-xs-offset-1 col-xs-3 change-to-ready\"><i class=\"fa fa-exclamation-triangle\"></i></button>')) +
										'<button class=\"btn btn-default btn-success col-xs-offset-1 col-xs-3 ' + statistics + '\"><i class=\"fa fa-bar-chart\"></i></button>' +
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
		
		function launchExercise(state, description, statement, topic, page, difficulty) {
			$.ajax({
				type: 'GET',
				url: 'http://exerclick-api.net46.net/launch-exercise.php',
				async: false,
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
		
		function showStatistics(id, exercisename) {
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
									'<div class=\"tab-title col-xs-2 col-lg-1\"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
									'<div class=\"tab-title col-xs-10 col-lg-11 ehuFontStyle\"><h4><i class=\"fa fa-bar-chart marginRight\"></i><span class="marginLeft">' + exercisename + '</span><span class="statistics-exercise-title"></span></h4></div>' +
								'</div>' +
								'<div class=\"clear\"></div>' +
								'<div class=\"row separator\"></div>' +
								'<div class=\"statistics-body\">' +
									'<div id=\"statistics-buttons\">' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-all-button" class="btn btn-default btn-primary active\">' +
												'<b>TODOS</b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-finished-button\" class=\"btn btn-default btn-primary\">' +
												'<b><i class=\"fa fa-check-square-o fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-finished\"> <span class=\"statistics-percentage statistics-percentage-finished\"></span></span></b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-question-button\" class=\"btn btn-default btn-primary\">' +
												'<b><i class=\"fa fa-exclamation fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-question\"> <span class=\"statistics-percentage statistics-percentage-question\"></span></span></b>' +
											'</button>' +
										'</div>' +
									'</div>' +
									'<div class=\"clear\"></div>' +
									'<div class=\"statistics-body-a\">' +
										'<div class=\"statistics-search form-group col-xs-12\">' +
											'<div class=\"col-xs-8 col-sm-10 col-md-10 col-lg-11\"><input type=\"search\" id="search-student-input" class=\"form-control\" placeholder=\"Buscar alumno\"></div>' +
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
					async: false,
					url: 'http://exerclick-api.net46.net/show-statistics.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { State: '%', Id: id, Key: '%' },
					success: function(data) {
						$('.darken').show();
						$('#container').append(
							'<div id=\"statistics\" class="statistics-exercise-finished" data-id="' + id + '">' +
								'<div id=\"statistics-title\">' +
									'<div class=\"tab-title col-xs-2 col-lg-1\"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
									'<div class=\"tab-title col-xs-10 col-lg-11 ehuFontStyle\"><h4><i class=\"fa fa-bar-chart marginRight\"></i>' + exercisename + '</h4></div>' +
								'</div>' +
								'<div class=\"clear\"></div>' +
								'<div class=\"row separator\"></div>' +
								'<div class=\"statistics-body\">' +
									'<div id=\"statistics-buttons\">' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-all-button" class="btn btn-default btn-primary active\">' +
												'<b>TODOS</b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-finished-button\" class=\"btn btn-default btn-primary\">' +
												'<b><i class=\"fa fa-check-square-o fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-finished\"> 100%<span class=\"statistics-percentage statistics-percentage-finished\"> (20/78)</span></span></b>' +
											'</button>' +
										'</div>' +
										'<div class=\"col-xs-4\">' +
											'<button type=\"button\" id=\"statistics-question-button\" class=\"btn btn-default btn-primary\">' +
												'<b><i class=\"fa fa-exclamation fa-fw\"></i><span class=\"statistics-button-data statistics-percentage-question\"> 1% <span class=\"statistics-percentage statistics-percentage-question\"> (1/78)</span></span></b>' +
											'</button>' +
										'</div>' +
									'</div>' +
									'<div class=\"clear\"></div>' +
									'<div class=\"statistics-body-a\">' +
										'<div class=\"statistics-search form-group col-xs-12\">' +
											'<div class=\"col-xs-8 col-sm-10 col-md-10 col-lg-11\"><input type=\"search\" id="search-student-input" class=\"form-control\" placeholder=\"Buscar alumno\"></div>' +
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
						$('.statistics-exercise-title').html();
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
					async: false,
					url: 'http://exerclick-api.net46.net/get-exercise-details.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { Id: id },
					success: function(data) {
						$('.darken').show();
						$('#container').append(
							'<div id=\"exercise-details\" data-id="' + data.exercise.id + '">' +
								'<div id=\"exercise-details-title\">' +
									'<div class=\"tab-title col-xs-3"><i class=\"back fa fa-reply btn btn-default\"></i></div>' +
									'<div class=\"tab-title col-xs-6\" align=\"center\"><h4 class="exercise-detail-description">' + data.exercise.description + '</h4></div>' +
									'<div class=\"tab-title col-xs-3\"><i class=\"config-exercise fa fa-cogs pull-right btn ui-corner-all ui-btn-b btn-primary\"></i></div>' + 
								'</div>' +
								'<div class=\"clear\"></div>' +
								'<div class=\"row separator\"></div>' +
								'<div class=\"exercise-details-body\">' +
									'<div class="exercise-details-title col-xs-12">Enunciado</div>' +
									'<p class="col-xs-12 exercise-detail-statement">' + data.exercise.statement + '</p>' + 
									'<div class="exercise-details-title col-lg-2 col-xs-6 bottompad">Tema</div><div class="exercise-detail exercise-detail-topic col-lg-2 col-xs-6">' + data.exercise.topic + '</div>' +
									'<div class=\"hidden-lg clear\"></div>' +
									'<div class="exercise-details-title col-lg-2 col-xs-6 bottompad">Página</div><div class="exercise-detail exercise-detail-page col-lg-2 col-xs-6">' + data.exercise.page + '</div>' +
									'<div class=\"hidden-lg  clear\"></div>' +
									'<div class="exercise-details-title col-lg-2 col-xs-6 bottompad">Dificultad</div><div class="exercise-detail exercise-detail-difficulty col-lg-2 col-xs-6">' + data.exercise.difficulty + '</div>' +
								'</div>' +
							'</div>'
						);
						$('#header').show();
						$('#state-buttons').show();
						var windowHeight = $(window).height();
						var offsetTop = $('#main').offset().top;
						var offsetBottom =  $('#overfooter').height() + $('#footer').height();
						
						$('#exercise-details').css('bottom', offsetBottom);
						$('#exercise-details').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
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
		
		function updateExercise(id, description, statement, topic, page, difficulty) {
			$.ajax({
				type: 'GET',
				async: false,
				url: 'http://exerclick-api.net46.net/change-exercise.php',
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
				if($('#statistics-finished-button').hasClass('active')) {
					$('#statistics-finished-button').removeClass('active');
				} else if($('#statistics-question-button').hasClass('active')) {		
					$('#statistics-question-button').removeClass('active');
				}
				$('.statistics-question-buttons').remove();
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
				$('.statistics-question-buttons').remove();
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
				$('.statistics-question-buttons').remove();
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
			
			$(document).on('vclick click tap', '#statistics-question-button', function() {	
				if($(this).parents('.statistics-exercise-finished').length) {
					$('#statistics-buttons').append(
						'<div class="statistics-question-buttons col-xs-offset-1 col-xs-10">' +
							'<div class=\"col-xs-4\">' +
								'<button type=\"button\" class="btn btn-default btn-info active btn-xs\">' +
									'<b>TODAS</b>' +
								'</button>' +
							'</div>' +
							'<div class=\"col-xs-4\">' +
								'<button type=\"button\" class=\"btn btn-default btn-info btn-xs\">' +
									'<b>RESUELTAS</b>' +
								'</button>' +
							'</div>' +
							'<div class=\"col-xs-4\">' +
								'<button type=\"button\" class=\"btn btn-default btn-info btn-xs\">' +
									'<b>SIN RESOLVER</b>' +
								'</button>' +
							'</div>' +
						'</div>'
					);
				}
			});
			
			
			$(document).on('vclick click tap', '.launch-exercise', function() {
				var description = $(this).parents('#new-exercise').find('input#input-exercise-id').val();
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
			});
			
			$(document).on('vclick click tap', '.save-exercise', function() {
				var description = $(this).parents('#new-exercise').find('input#input-exercise-id').val();
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
				launchExercise('Ready', description, statement, topic, page, difficulty);
			});
			
			$(document).on('vclick click tap', '.config-exercise', function() {
				if(!$(this).parents('#exercise-details').find('.exercise-detail-statement').find('textarea').length) {
					var description = $(this).parents('#exercise-details').find('.exercise-detail-description').html();
					var statement  = $(this).parents('#exercise-details').find('.exercise-detail-statement').html();
					var topic = $(this).parents('#exercise-details').find('.exercise-detail-topic').html();
					var page = $(this).parents('#exercise-details').find('.exercise-detail-page').html();
					var difficulty = $(this).parents('#exercise-details').find('.exercise-detail-difficulty').html();

					$(this).parents('#exercise-details').find('.exercise-detail-description').html('<input type=\"text\" class=\"form-control\" id="input-exercise-description" placeholder=\"Descripción\" value="' + description + '">');
					$(this).parents('#exercise-details').find('.exercise-detail-statement').html('<textarea class=\"form-control\" id="input-exercise-statement" placeholder=\"Enunciado\" rows="3">' + statement + '</textarea>');
					$(this).parents('#exercise-details').find('.exercise-detail-topic').html('<input type=\"text\" class=\"form-control\" id="input-exercise-topic" placeholder=\"Tema\" value="' + topic + '">');
					$(this).parents('#exercise-details').find('.exercise-detail-page').html('<input type=\"text\" class=\"form-control\" id="input-exercise-page" placeholder=\"Página\" value="' + page + '">');
					$(this).parents('#exercise-details').find('.exercise-detail-difficulty').html('<input type=\"text\" class=\"form-control\" id="input-exercise-difficulty" placeholder=\"Dificultad\" value="' + difficulty + '">');
					
					$('.exercise-details-body').append(
						'<button type="button" class="btn btn-default btn-primary save-changes">' +
							'<div class="bold">GUARDAR CAMBIOS</div>' +
						'</button>'
					);
				} else {
					var description = $(this).parents('#exercise-details').find('#input-exercise-description').val();
					var statement  = $(this).parents('#exercise-details').find('#input-exercise-statement').val();
					var topic = $(this).parents('#exercise-details').find('#input-exercise-topic').val();
					var page = $(this).parents('#exercise-details').find('#input-exercise-page').val();
					var difficulty = $(this).parents('#exercise-details').find('#input-exercise-difficulty').val();

					$(this).parents('#exercise-details').find('.exercise-detail-statement').html(statement);
					$(this).parents('#exercise-details').find('.exercise-detail-topic').html(topic);
					$(this).parents('#exercise-details').find('.exercise-detail-page').html(page);
					$(this).parents('#exercise-details').find('.exercise-detail-difficulty').html(difficulty);
					
					$('.save-changes').remove();
				}
			});
			
			$(document).on('vclick click tap', '.save-changes', function() {
				var id = $(this).parents('#exercise-details').attr('data-id');
				var description = $(this).parents('#exercise-details').find('#input-exercise-description').val();
				var statement  = $(this).parents('#exercise-details').find('#input-exercise-statement').val();
				var topic = $(this).parents('#exercise-details').find('#input-exercise-topic').val();
				var page = $(this).parents('#exercise-details').find('#input-exercise-page').val();
				var difficulty = $(this).parents('#exercise-details').find('#input-exercise-difficulty').val();
				
				parent = $(this).parents('#exercise-details');

				updateExercise(id, description, statement, topic, page, difficulty).done(function() {
					parent.find('.exercise-detail-description').html(description);
					parent.find('.exercise-detail-statement').html(statement);
					parent.find('.exercise-detail-topic').html(topic);
					parent.find('.exercise-detail-page').html(page);
					parent.find('.exercise-detail-difficulty').html(difficulty);
					$('.save-changes').remove();
				});
			});
			
			$(document).on('vclick click tap', '.advanced-exercise', function() {
				$('.advanced-exercise').html('<b>MENOS</b>');
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
				$('.advanced-exercise-occult').html('<b>AVANZADO</b>');
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
					async: false,
					url: 'http://exerclick-api.net46.net/change-subject.php',
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
				var text = optionSelected.text();
				var lang = '';
				switch(text) {
					case 'Castellano':
						lang = 'es';
						break;
					case 'Euskera':
						lang = 'eu';
						break;
				}
				$.ajax({
					type: 'GET',
					async: false,
					url: 'http://exerclick-api.net46.net/change-lang.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					data: { Language: lang },
					success: function(data) {
						loadData();
					}
				});
			});
			
			$('.profile-logout').on('click', function () {
				$.ajax({
					type: 'GET',
					async: false,
					url: 'http://exerclick-api.net46.net/end-session.php',
					jsonpCallback: 'jsonCallback',
					contentType: "application/json",
					dataType: 'jsonp',
					success: function(data) {
						window.location.replace(data.next);
					}
				});
			});
			
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

				if($('#statistics').length != 0) {
					$('.statistics-list-container').css('height', windowHeight - offsetBottom - $('.statistics-body-a').offset().top -
					2*$('.statistics-search').height() - Math.floor(parseFloat($('body').css('font-size'))));
					$('.statistics-list-content').css('height', $('.statistics-list-container').height() - Math.floor(parseFloat($('body').css('font-size'))));
				}
				
				if($('#exercise-details').length != 0) {
					$('#exercise-details').css('bottom', offsetBottom);
					$('#exercise-details').css('height', $('#exercises-container').height() + 2 * $('#state-buttons').height());
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
	});
});

