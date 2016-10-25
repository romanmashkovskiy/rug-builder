var $ = jQuery;

$(document).ready(function() {

	var slider = $('.materials-slider').bxSlider();

	$('.next-slide').on('click', function() {
		slider.goToNextSlide();

		var curActive;

		$('.slide__list li').each(function(i, v) {

			if ( $(v).children('img').hasClass('active') ) {
				curActive = $(v).data('slide');
				$(v).children('img').removeClass('active');
			}
		});

		var newActive = curActive + 1;

		if ( curActive < 5 ) {
			$('.slide__list li[data-slide="' + newActive + '"] img').addClass('active');
		} else {
			$('.slide__list li[data-slide="0"] img').addClass('active');
		}
	});

	$('.prev-slide').on('click', function() {
		slider.goToPrevSlide();

		var curActive;

		$('.slide__list li').each(function(i, v) {

			if ( $(v).children('img').hasClass('active') ) {
				curActive = $(v).data('slide');
				$(v).children('img').removeClass('active');
			}
		});

		var newActive = curActive - 1;

		if ( curActive > 0 ) {
			$('.slide__list li[data-slide="' + newActive + '"] img').addClass('active');
		} else {
			$('.slide__list li[data-slide="5"] img').addClass('active');
		}
	});

	$('.slide__list li').on('click', function() {
		var newActive = $(this).data('slide');

		slider.goToSlide(newActive);

		$(this).siblings().each(function(i, v) {

			var curActive;

			if ( $(v).children('img').hasClass('active') ) {
				curActive = $(v).data('slide');
			}

			$('li[data-slide="' + curActive + '"] img').removeClass('active');
		})

		$('li[data-slide="' + newActive + '"] img').addClass('active');
	});

	$('.material-slide .slide__content').css('cssText', 'height: calc(100% - 60px)');
});