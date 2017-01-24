var $ = jQuery;

$(document).ready(function() {

	function closeInfoBox() {

		var boxWidth;

		if ( window.innerWidth > 992 ) {
			boxWidth = 400;
		} else if ( window.innerWidth > 768 && window.innerWidth < 993 ) {
			boxWidth = 325;
		} else {
			boxWidth = 200;
		}

		$('.material__details').animate({
			right: '-' + boxWidth + 'px'
		})

		$('.hide-material-info').text('Show')
		$('.hide-material-info').data('state', 'closed');
	}

	function openInfoBox() {

		var right; 

		if ( window.innerWidth > 450 ) {
			right = '20px';
		} else {
			right = '0px';
		}

		$('.material__details').animate({
			right: right
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

	$('.change-image-view').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var currentView = $(this).data('view');

		var newSrc, newView, newHeight;

		if ( currentView === 'top' ) {

			newSrc    = $(this).data('angle');
			newView   = 'angle';
			newHeight = 'auto';

		} else {

			newSrc    = $(this).data('top');
			newView   = 'top';
			newHeight = '450px';
		}

		$(this).siblings('img').attr('src', newSrc);

		$(this).data('view', newView);

		$(this).siblings('img').on('load', function(){
			$(this).parent().css('height', newHeight);
		});

		return false;
	});

	$(document).on('click', '#add-swatch-to-basket', function(e) {

		e.preventDefault();
		e.stopPropagation();

		$('body').css('cursor', 'wait');
		$('a').css('cssText', 'cursor: wait !important;');

		var productName = $(this).data('product-name');
		var productID   = $(this).data('product-id');
		var url         = window.location.href + '?post_type=product&add-to-cart=' + productID;

		$.get(url)
			.done(function() {

				window.location.reload();

				$('body').removeClass('basket-empty');
				$('body').addClass('basket-full');

				var oldNumItems = parseInt( $('#num-items-basket').text() );
				var newNumItems = oldNumItems + 1;

				$('#num-items-basket').text(newNumItems);
			})
			.fail(function() {
//				showBasketPopup(false);
			})

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