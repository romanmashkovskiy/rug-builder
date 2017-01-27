var $ = jQuery;

$(document).ready(function() {

	$('.insp-menu__link').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var content = $(this).data('content');

		window.location.hash = content;

		switch ( content ) {

			case 'social' :
				$('.inspiration__photos').hide();
				$('.inspiration__videos').hide();
				$('.inspiration__social').show();
				break;

			case 'room-shots' :
				$('.inspiration__social').hide();
				$('.inspiration__videos').hide();
				$('.inspiration__photos').show();

				$('.grid').masonry({
					itemSelector    : '.grid-item',
					percentPosition : true
				});

				break;

			case 'videos' :
				$('.inspiration__photos').hide();
				$('.inspiration__social').hide();
				$('.inspiration__videos').show();
				break;

		}

		return false;
	});
})