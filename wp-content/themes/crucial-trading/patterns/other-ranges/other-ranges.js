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

	$('.ranges__ul .range').each(function(i, e) {

		var thisHeight = $(e).children().children().children('h3').height();

		if ( thisHeight < bottom ) {
			
			var difference = bottom - thisHeight;

			$(e).children().children().children('h3').css('padding-top', difference)
		}

	});

});