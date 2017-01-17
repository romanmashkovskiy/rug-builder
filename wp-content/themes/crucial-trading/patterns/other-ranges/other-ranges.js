var $ = jQuery;

$(document).ready(function() {

	if ( $('.ranges__ul').length === 0 ) {
		return;
	}

	var bottom = 0;

	$('.ranges__ul .range').each(function(i, e) {

		var height = $(e).children().children().children('h3').height();
		
		if ( height > bottom ) {
			bottom = height;
		}
	});

	bottom = bottom + 10;

	$('.ranges__ul .range').each(function(i, e) {

		$(e).children().children().children('img').css('bottom', bottom);

	});

});