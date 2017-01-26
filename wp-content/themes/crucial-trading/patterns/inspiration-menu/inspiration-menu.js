var $ = jQuery;

$(document).ready(function() {

	$('.insp-menu__link').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var content = $(this).data('content');

		window.location.hash = content;

		return false;
	});
})