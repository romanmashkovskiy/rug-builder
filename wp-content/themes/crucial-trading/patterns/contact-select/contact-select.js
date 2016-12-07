var $ = jQuery;

$(document).ready(function() {

	$('.contact-select select').change(function() {

		var value = $('.contact-select select').val();
		
		switch (value) {

			case 'general' :
				$('.contact-form #press').hide();
				$('.contact-form #trade').hide();
				$('.page-image img[data-tag="press"]').addClass('__hidden');
				$('.page-image img[data-tag="trade"]').addClass('__hidden');
				break;

			case 'press' :
				$('.contact-form #trade').hide();
				$('.contact-form #general').hide();
				$('.page-image img[data-tag="general"]').addClass('__hidden');
				$('.page-image img[data-tag="trade"]').addClass('__hidden');
				break;

			case 'trade' :
				$('.contact-form #press').hide();
				$('.contact-form #general').hide();
				$('.page-image img[data-tag="press"]').addClass('__hidden');
				$('.page-image img[data-tag="general"]').addClass('__hidden');
				break;
		}
		
		$('.contact-form #' + value).show();
		$('.page-image img[data-tag="' + value + '"]').removeClass('__hidden');
	});
});