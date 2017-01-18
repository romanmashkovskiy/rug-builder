var $ = jQuery;

$(document).ready(function() {

	var slider = $('.materials-slider').bxSlider({
		mode: 'fade',
		onSliderLoad: function() {
			setTimeout(function() {
				$('.slide__content').addClass('slider-loaded');
			}, 100)
		}
	});

	$('.next-slide.--material-slider').on('click', function() {
		slider.goToNextSlide();

		var curActive;

		$('.slide__list li').each(function(i, v) {

			if ( $(v).children('img').hasClass('active') ) {
				curActive = $(v).data('slide');
				$(v).children('img').removeClass('active');
			}
		});

		var newActive = curActive + 1;

		if ( curActive === 5 ) {
			newActive = 0;
		}

		$('.slide__list li[data-slide="' + newActive + '"] img').addClass('active');

		var oldSlide    = $('.materials-slider li.material-slide')[curActive];
		var oldMaterial = $(oldSlide).data('material');
		var newSlide    = $('.materials-slider li.material-slide')[newActive];
		var newMaterial = $(newSlide).data('material');

		$(this).removeClass(oldMaterial);
		$('.prev-slide').removeClass(oldMaterial);
		$(this).addClass(newMaterial);
		$('.prev-slide').addClass(newMaterial);
	});

	$('.prev-slide.--material-slider').on('click', function() {
		slider.goToPrevSlide();

		var curActive;

		$('.slide__list li').each(function(i, v) {

			if ( $(v).children('img').hasClass('active') ) {
				curActive = $(v).data('slide');
				$(v).children('img').removeClass('active');
			}
		});

		var newActive = curActive - 1;

		if ( curActive === 0 ) {
			newActive = 5;
		}

		$('.slide__list li[data-slide="' + newActive + '"] img').addClass('active');

		var oldSlide    = $('.materials-slider li.material-slide')[curActive];
		var oldMaterial = $(oldSlide).data('material');
		var newSlide    = $('.materials-slider li.material-slide')[newActive];
		var newMaterial = $(newSlide).data('material');

		$(this).removeClass(oldMaterial);
		$('.next-slide').removeClass(oldMaterial);
		$(this).addClass(newMaterial);
		$('.next-slide').addClass(newMaterial);
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

	setTimeout(function() {
		$('.material-slide').each(function(i, v) {
			$(v).css({
				top: 0,
				bottom: 0
			});
		});
	}, 500)
});