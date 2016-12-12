// Add to Basket Confirmation Message

function showBasketPopup(success, productName) {

	$('.basketMessage').html('');

	if ( success ) {
		$('.basketMessage').html(productName + ' has been added to your <a href="' + siteURL + '/basket">basket</a>.');
	} else {
		$('.basketMessage').html('Sorry, an error has occured and ' + productName + ' could not be added to your basket. Please try again.');
	}

	$('.basketPopup').show();
}

$(document).ready(function() {

	// Login Form Placeholders

	$('#user_login').attr('placeholder', 'Username or Email');
	$('#user_pass').attr('placeholder', 'Password');

	// Inspiration Page Extra Content

	if ( $('body').hasClass('page-template-inspiration') || $('body').hasClass('page-template-home') ) {

		$('.fts-twitter-link-image').each(function(i, e) {
			$(e).append('<i class="icon-crucial-instagram"></i>')
		});

		$('.fts-instagram-wrapper').each(function(i, e) {
			$(e).append('<i class="icon-crucial-instagram"></i>')
		});

		$('.fts-twitter-text').each(function(i, e) {
			$(e).append('<div class="twitter-shadow"></div>')
		});
	}

	// Close Add to Basket Confirmation Message

	$(document).on('click', '#close-basket-popup', function(e) {

		e.preventDefault();
		e.stopPropagation();

		$('.basketPopup').hide();

		return false;
	});
});