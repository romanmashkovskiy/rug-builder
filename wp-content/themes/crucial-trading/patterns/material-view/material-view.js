var $ = jQuery;

$(document).ready(function() {

	function closeInfoBox() {

		var boxWidth;

		if ( window.innerWidth > 768 ) {
			boxWidth = 274;
		} else {
			boxWidth = 165;
		}

		$('.material__info').animate({
			right: '-' + boxWidth + 'px'
		})

		$('#hide-material-info').text('Show')
		$('#hide-material-info').data('state', 'closed');
	}

	function openInfoBox() {

		$('.material__info').animate({
			right: '20px'
		})

		$('#hide-material-info').text('Hide')
		$('#hide-material-info').data('state', 'open');
	}

	$('#hide-material-info').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var state = $(this).data('state');

		if ( state === 'open' ) {
			closeInfoBox();
		}
		else if ( state === 'closed' ) {
			openInfoBox();
		}

		return false;
	});
});