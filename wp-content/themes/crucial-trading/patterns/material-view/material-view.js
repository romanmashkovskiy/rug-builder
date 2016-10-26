var $ = jQuery;

$(document).ready(function() {

	console.log($('.material__info').offset())

	function closeInfoBox() {

		var boxWidth   = $('.material__info').width();
		var totalWidth = boxWidth + 20;

		$('.material__info').animate({
			right: '-' + boxWidth + 'px'
		})

		$('#hide-material-info').text('Show')
		$('#hide-material-info').data('state', 'closed');
	}

	function openInfoBox() {

		var boxHeight = $('.material__info').height();

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