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