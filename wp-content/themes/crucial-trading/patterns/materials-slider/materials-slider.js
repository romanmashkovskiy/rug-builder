var $ = jQuery;

$(document).ready(function() {

	var slider = $('.materials-slider').bxSlider();

	console.log(slider)

	$('.next-slide').on('click', function() {
		slider.goToNextSlide();
	});

	$('.prev-slide').on('click', function() {
		slider.goToPrevSlide();
	});

	$('.slide__list li').on('click', function() {
		var newIndex = $(this).data('slide');

		slider.goToSlide(newIndex);

		$(this).siblings().each(function(i, v) {

			var oldIndex;

			if ( $(v).children('img').hasClass('active') ) {
				oldIndex = $(v).data('slide');
			}

			$('li[data-slide="' + oldIndex + '"] img').removeClass('active');
		})

		$('li[data-slide="' + newIndex + '"] img').addClass('active');
	});

	$('.material-slide .slide__content').css('cssText', 'height: calc(100% - 60px)');
});