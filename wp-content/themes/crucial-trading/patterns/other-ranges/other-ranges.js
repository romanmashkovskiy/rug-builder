/*

var $ = jQuery;

$(document).ready(calcPadding);
window.addEventListener('resize', calcPadding);

function calcPadding() {

	return;

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

		console.log($(e).children().children().children('h3').text())
		console.log($(e).children().children().children('h3').height())
		console.log(e.children[0].children[0].children[1].offsetHeight)
		console.log(thisHeight)
		console.log(bottom)
		console.log(thisHeight < bottom)
		console.log(bottom - thisHeight)

		if ( thisHeight < bottom ) {
			var difference = bottom - thisHeight;
			$(e).children().children().children('h3').css('padding-top', difference);
		} else if ( thisHeight === bottom ) {
			$(e).children().children().children('h3').css('padding-top', '0px');
		}

	});
}

*/