var $ = jQuery;

$(document).ready(function() {

	function closeInfoBox() {

		var boxWidth;

		if ( window.innerWidth > 768 ) {
			boxWidth = 296;
		} else {
			boxWidth = 165;
		}

		$('.material__details').animate({
			right: '-' + boxWidth + 'px'
		})

		$('.hide-material-info').text('Show')
		$('.hide-material-info').data('state', 'closed');
	}

	function openInfoBox() {

		$('.material__details').animate({
			right: '20px'
		})

		$('.hide-material-info').text('Hide')
		$('.hide-material-info').data('state', 'open');
	}

	$('.hide-material-info').on('click', function(e) {

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

	$('#change-image-view').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var currentView = $(this).data('view');

		if ( currentView === 'top' ) {

			$(this).siblings('img').attr('src', $(this).data('angle'));

			$(this).parent().css('height', 'auto');

			$(this).siblings('img').css({
				height     : 'auto',
				marginLeft : '25%',
				width      : '50%'
			});

			$(this).data('view', 'angle');

		} else {

			$(this).siblings('img').attr('src', $(this).data('top'));

			$(this).parent().css('height', '450px');

			$(this).siblings('img').css({
				height     : '100%',
				marginLeft : '0',
				width      : '100%'
			});

			$(this).data('view', 'top');
		}

		return false;
	});

	$(document).on('click', '#add-swatch-to-basket', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var productName = $(this).data('product-name');
		var productID   = $(this).data('product-id');
		var url         = window.location.href + '?post_type=product&add-to-cart=' + productID;

		$.get(url)
			.done(function() {
				showBasketPopup(true, productName);
			})
			.fail(function() {
				showBasketPopup(false);
			})

		return false;
	});

	function showBasketPopup(success, productName) {

		$('.basketMessage').html('');

		console.log(window.location)

		if ( success ) {
			$('.basketMessage').html(productName + ' has been added to your <a href="' + siteURL + '/basket">basket</a>.');
		} else {
			$('.basketMessage').html('Sorry, an error has occured and ' + productName + ' could not be added to your basket. Please try again.');
		}

		$('.basketPopup').show();
	}

	$(document).on('click', '#close-basket-popup', function(e) {

		e.preventDefault();
		e.stopPropagation();

		$('.basketPopup').hide();

		return false;
	});

//	$('.material-img').each(function(i, v) {
//		$(v).elevateZoom({
//			zoomType  : 'lens',
//			lensShape : 'round',
//			lensSize  : 200
//		});
//	});
});