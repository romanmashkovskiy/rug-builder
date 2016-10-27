$ = jQuery;

$(document).ready(function() {

	var slider = $('#super-slider').superslides({
		play: 1000000,
		animation: 'fade',
		animation_speed: 1200
	});

	$('.slide__numbers li').on('click', function() {

		var thisText = $(this).text();
		var index = parseInt(thisText.replace('0', '').replace('.', '')) - 1;

		$('#super-slider').superslides('animate', index)
	});
});