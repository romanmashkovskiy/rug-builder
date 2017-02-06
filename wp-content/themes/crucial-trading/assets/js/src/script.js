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

	// Cookies & Video Autoplay
/*
	if ( $('body').hasClass('page-template-home') ) {

		var cookieExists = Cookies.get('visited');

		if ( typeof cookieExists === 'undefined' ) {
			$('.html5lightbox').click();
			Cookies.set('visited', 'true');
		}
	}
*/
	// Headroom

	$('.top-bar').headroom({
		offset : 50,
		tolerance : 5
	})

	if ( $('body').hasClass('page-template-home') ) {

		var observer = new MutationObserver(function(mutations) {

			mutations.forEach(function(mutation) {
				
				if ( $('.top-bar').hasClass('headroom--not-top') && $('.top-bar').hasClass('headroom--pinned') ) {
					$('.full-logo').attr('src', 'http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/26174004/logo.svg');
					$('.mobi-logo').attr('src', 'http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/26174002/logo-mobile.svg');
				} else {
					$('.full-logo').attr('src', 'http://d105txpzekqrfa.cloudfront.net/uploads/20170125174752/logo-black.svg');
					$('.mobi-logo').attr('src', 'http://d105txpzekqrfa.cloudfront.net/uploads/20170125174756/logo-mobile-black.svg');
				}
			});    
		});

		var observerConfig = {
			attributes: true
		};

		var targetNode = document.querySelector('.top-bar');
		observer.observe(targetNode, observerConfig);
	}

	// Fade Out WC Basket Notice

	if ( $('.woocommerce-message').length > 0 ) {
		setTimeout(function() {
			$('.woocommerce-message').fadeOut(800);
		}, 4000)
	}

	// Check Form Validation

	if ( $('#place_order').length > 0 ) {

		$('#place_order').on('click', function(e) {

			var stop = false;

			if ( $('#shipping_first_name').val() === '' ) {
				$('#shipping_first_name').css('cssText', 'border: 1px solid #a00 !important');
				$('.shipping-address-errors').append('<p>Please enter a first name.</p>');
				stop = true;
			}

			if ( $('#shipping_last_name').val() === '' ) {
				$('#shipping_last_name').css('cssText', 'border: 1px solid #a00 !important');
				$('.shipping-address-errors').append('<p>Please enter a last name.</p>');
				stop = true;
			}

			if ( $('#shipping_address_1').val() === '' ) {
				$('#shipping_address_1').css('cssText', 'border: 1px solid #a00 !important');
				$('.shipping-address-errors').append('<p>Please enter a street address.</p>');
				stop = true;
			}

			if ( $('#shipping_city').val() === '' ) {
				$('#shipping_city').css('cssText', 'border: 1px solid #a00 !important');
				$('.shipping-address-errors').append('<p>Please enter a town or city.</p>');
				stop = true;
			}

			if ( $('#shipping_postcode').val() === '' ) {
				$('#shipping_postcode').css('cssText', 'border: 1px solid #a00 !important');
				$('.shipping-address-errors').append('<p>Please enter a post code.</p>');
				stop = true;
			}

			if ( $('#billing_email').val() === '' ) {
				$('#billing_email').css('cssText', 'border: 1px solid #a00 !important');
				$('.shipping-address-errors').append('<p>Please enter an email address.</p>');
				stop = true;
			}

			if ( $('#account_password').val() === '' ) {
				$('#account_password').css('cssText', 'border: 1px solid #a00 !important');
				$('.shipping-address-errors').append('<p>Please enter an email address.</p>');
				stop = true;
			}

			if ( stop ) {
				console.log(6)
				e.preventDefault();
				e.stopPropagation();
				return false;
			}

		})
	}

	// Checkout Form Fix Styling

	if ( $('.woocommerce').length > 0 ) {

		$('.woocommerce .form-row').each(function(i, e) {

			var label       = $(e).children('label');
			var current     = label.text();
			var input       = $(e).children('input');
			var placeholder = input.attr('placeholder');

			if ( typeof placeholder === 'undefined' ) {
				return;
			}

			if ( placeholder !== '' ) {
				current = placeholder;
			}

			var text = current.replace('*', '').replace('(optional)', '');

			input.attr('placeholder', text);

		})
	}		

	// Login and Register Form Placeholders

	$('input#username').attr('placeholder', 'Email');
	$('input#password').attr('placeholder', 'Password');
	$('input#reg_email').attr('placeholder', 'Email');
	$('input#reg_password').attr('placeholder', 'Password');

	// Set Hospitality Username to Email

	$('.page-template-hospitality-register input[name="reg_submit"]').on('click', function() {
		var email = $('input[name="reg_email"]').val();
		$('input[name="reg_username"]').val(email);
	})

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