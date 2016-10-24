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
		slider.goToSlide( $(this).data('slide') );
	});

	$('.material-slide .slide__content').css('cssText', 'height: calc(100% - 60px)');
});