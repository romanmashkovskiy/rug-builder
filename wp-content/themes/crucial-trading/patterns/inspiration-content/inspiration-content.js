var $ = jQuery;

var INSP_CONTENT = {};

INSP_CONTENT.hash = window.location.hash;

switch ( INSP_CONTENT.hash ) {

	case '#room-shots' :
		INSP_CONTENT.content = 'photos';
		break;

	case '#videos' :
		INSP_CONTENT.content = 'videos';
		break;

	default :
		INSP_CONTENT.content = 'social';
		break;
}

$(document).ready(function() {

	if ( INSP_CONTENT.content !== 'social' ) {

		$('.inspiration__social').hide();

		var selector = '.inspiration__' + INSP_CONTENT.content;

		$(selector).show();

	}

	if ( INSP_CONTENT.content === 'photos' ) {

		$('.grid').masonry({
			itemSelector    : '.grid-item',
			percentPosition : true
		});

	}

	if ( $('body').hasClass('page-template-inspiration') ) {

		var offsets = [];

		for ( var i = 0; i < 10; i++ ) {
			if ( typeof $('.timeline__event__ball')[i] !== 'undefined' ) {
				offsets[i] = $($('.timeline__event__ball')[i]).offset().top;
			} else {
				offsets[i] = 10000000;
			}
		}

		if ( offsets[1] < offsets[0] ) {
			moveLineDown(1, 0)
		}

		if ( offsets[3] < offsets[2] ) {
			moveLineDown(3, 2)
		}

		if ( offsets[5] < offsets[4] ) {
			moveLineDown(5, 4)
		}

		if ( offsets[7] < offsets[6] ) {
			moveLineDown(7, 6)
		}

		if ( offsets[9] < offsets[8] ) {
			moveLineDown(9, 8)
		}

		function moveLineDown(a, b) {

			var difference = offsets[a] - offsets[b];

			if ( difference > -25 ) {
				difference = -25;
			}

			var newTop     = difference * -2 + 'px';

			$($('.timeline__event__line')[a]).css('margin-top', newTop);

		}

	}

});