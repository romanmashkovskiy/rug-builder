var $ = jQuery;

$(document).ready(function() {

	function closeInfoBox() {

		$('.material__info').animate({
			right: '-274px'
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