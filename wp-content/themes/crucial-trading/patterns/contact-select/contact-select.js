var $ = jQuery;

$(document).ready(function() {

	$('.contact-select select').change(function() {

		var value     = $('.contact-select select').val();
		var prevValue = value === 'press' ? 'general' : 'press';
		
		$('.contact-form #' + prevValue).hide();
		$('.contact-form #' + value).show();
	});
});