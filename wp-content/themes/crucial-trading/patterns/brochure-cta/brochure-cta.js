var $ = jQuery;

$(document).ready(function() {

	$('.order-brochure').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var productName = $(this).data('product-name');
		var productID   = $(this).data('product-id');

		var url = '';

		var href = window.location.href;

		if ( href[href.length - 1] === '#' ) {
			href = window.location.href.substr(0, window.location.href.length - 1)
		}

		var url = href + 'product/brochure/?post_type=product&add-to-cart=' + productID;

		console.log(url)

		$.get(url)
			.done(function() {

				$('body').removeClass('basket-empty');
				$('body').addClass('basket-full');

				var oldNumItems = parseInt( $('#num-items-basket').text() );
				var newNumItems = oldNumItems + 1;

				$('#num-items-basket').text(newNumItems);
			})
			.fail(function() {
//				alert('fail');
			});

		return false;
	});
});