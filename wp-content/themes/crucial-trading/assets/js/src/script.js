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

	// Fade Out WC Basket Notice

	if ( $('.woocommerce-message').length > 0 ) {
		setTimeout(function() {
			$('.woocommerce-message').fadeOut(800);
		}, 4000)
	}

	// Checkout Form Fix Styling

	if ( $('.woocommerce').length > 0 ) {

		$('.woocommerce .form-row').each(function(i, e) {

			var label       = $(e).children('label');
			var input       = $(e).children('input');
			var placeholder = input.attr('placeholder');

			if ( typeof placeholder === 'undefined' ) {
				return;
			}

			if ( placeholder !== '' ) {
				return;
			}

			var text = label.text().replace('*','');

			input.attr('placeholder', text);

		})
	}		

	// Login Form Placeholders

	$('#user_login').attr('placeholder', 'Username or Email');
	$('#user_pass').attr('placeholder', 'Password');

	// Close Add to Basket Confirmation Message

	$(document).on('click', '#close-basket-popup', function(e) {

		e.preventDefault();
		e.stopPropagation();

		$('.basketPopup').hide();

		return false;
	});

	// Basket Dropdown Checkout Button

	$('.checkout-button.wc-forward').text('Checkout');

	// Object Fit Fallback

	if ( !Modernizr.objectfit && $('.object-fit-container').length > 0 ) {

		$('.object-fit-container').each(function() {

			var container = $(this);
			var src       = container.find('img').prop('src');

			if ( src ) {
				container.css('background-image', 'url(' + src + ')');
				container.addClass('fallback-object-fit');
			}
		})
	}
});