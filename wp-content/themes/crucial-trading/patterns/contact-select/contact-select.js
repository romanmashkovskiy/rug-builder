var $ = jQuery;



$(document).ready(function() {

	if ( $('body').hasClass('page-template-contact') ) {

		var intvl = setInterval(function() {
			if ( window.location.hash ) {
				window.scrollTo(0, 0);
			}
		}, 1)

		setTimeout(function() {
			clearInterval(intvl);
		}, 200)
	}

		

	$('.contact-select select').change(function() {

		var value = $('.contact-select select').val();

		window.location.hash = value;
		showCorrectForm(value);

	});

	var hash = window.location.hash.substr(1);

	if ( hash !== '' ) {

		var forms = ['general', 'press', 'trade'];

		if ( forms.indexOf(hash) > -1 ) {

			$('.contact-select select option[value="' + hash + '"]').attr('selected', 'selected');
			showCorrectForm(hash)
			
		}
	}
});

function showCorrectForm(value) {

	switch (value) {

		case 'general' :
			$('.contact-form #press').addClass('__hidden');
			$('.contact-form #trade').addClass('__hidden');

			$('.page-image img[data-tag="press"]').addClass('__hidden');
			$('.page-image img[data-tag="trade"]').addClass('__hidden');

			setTimeout(function() {
				$('.contact-form #press').addClass('__noHeight');
				$('.contact-form #trade').addClass('__noHeight');
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
}