var $ = jQuery;

$(document).ready(function() {

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

			var slideHeight = $(this).parent().parent().parent().parent().height();
			$('.material-view-slider').css('min-height', slideHeight + 'px');

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