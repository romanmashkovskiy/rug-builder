var $ = jQuery;

$(document).ready(function() {

	if ( $('body').hasClass('page-template-retailer') ) {

		var h = $('.retailer').height();

		$('.border-div').each(function(i, v) {
			$(v).height(h + 'px');
		});
	}
});