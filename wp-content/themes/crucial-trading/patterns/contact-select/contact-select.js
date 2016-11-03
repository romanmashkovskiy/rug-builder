var $ = jQuery;

$(document).ready(function() {

	$('.contact-select select').change(function() {

		var value = $('.contact-select select').val();
		
		switch (value) {

			case 'general' :
				$('.contact-form #press').hide();
				$('.contact-form #trade').hide();
				break;

			case 'press' :
				$('.contact-form #trade').hide();
				$('.contact-form #general').hide();
				break;

			case 'trade' :
				$('.contact-form #press').hide();
				$('.contact-form #general').hide();
				break;
		}
		
		$('.contact-form #' + value).show();
	});
});