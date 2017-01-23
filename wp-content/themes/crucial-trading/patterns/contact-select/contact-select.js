var $ = jQuery;

$(document).ready(function() {

	$('.contact-select select').change(function() {

		var value = $('.contact-select select').val();
		
		switch (value) {

			case 'general' :
				$('.contact-form #press').addClass('__hidden');
				$('.contact-form #trade').addClass('__hidden');

				$('.page-image img[data-tag="press"]').addClass('__hidden');
				$('.page-image img[data-tag="trade"]').addClass('__hidden');

				setTimeout(function() {
					$('.contact-form #press').addClass('__noHeight');
					$('.contact-form #trade').addClass('__noHeight');-
				}, 250)
				break;

			case 'press' :
				$('.contact-form #trade').addClass('__hidden');
				$('.contact-form #general').addClass('__hidden');

				$('.page-image img[data-tag="general"]').addClass('__hidden');
				$('.page-image img[data-tag="trade"]').addClass('__hidden');

				setTimeout(function() {
					$('.contact-form #trade').addClass('__noHeight');
					$('.contact-form #general').addClass('__noHeight');
				}, 250)
				break;

			case 'trade' :
				$('.contact-form #press').addClass('__hidden');
				$('.contact-form #general').addClass('__hidden');

				$('.page-image img[data-tag="press"]').addClass('__hidden');
				$('.page-image img[data-tag="general"]').addClass('__hidden');

				setTimeout(function() {
					$('.contact-form #press').addClass('__noHeight');
					$('.contact-form #general').addClass('__noHeight');
				}, 250)
				break;
		}

		setTimeout(function() {
			$('.contact-form #' + value).removeClass('__noHeight');
			$('.contact-form #' + value).removeClass('__hidden');

			$('.page-image img[data-tag="' + value + '"]').removeClass('__hidden');
		}, 250)
		
		
		
	});
});