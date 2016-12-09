var $ = jQuery;

$(document).ready(function() {

	$('.order-brochure').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		$('body').css('cursor', 'wait');
		$(this).css('cursor', 'wait');

		var productName = $(this).data('product-name');
		var productID   = $(this).data('product-id');

		var url = '';

		var href = window.location.href;

		if ( href[href.length - 1] === '#' ) {
			href = window.location.href.substr(0, window.location.href.length - 1)
		}

		var url = href + 'product/brochure/?post_type=product&add-to-cart=' + productID;

		$.get(url)
			.done(function() {
				$('body').css('cursor', 'auto');
				$(this).css('cursor', 'pointer');
				showBasketPopup(true, productName);
			})
			.fail(function() {
				showBasketPopup(false, '');
			});

		return false;
	});
});