var $ = jQuery;

$(document).ready(function() {

	function queryPostCode() {
		if ( $('.overseas-partners').length === 1 ) {

			// Submitting a UK postcode

			var postCode = $('.retailer-search input').val();

			if ( postCode === '' ) {
				alert('Please enter a post code');
				return;
			}

			var url = window.location.origin + window.location.pathname + '?postcode=' + encodeURIComponent(postCode);

			window.location.href = url;

		} else if ( $('.uk-retailers').length === 1 ) {

			// Submitting a country

			var country = $('.retailer-search select').val();
			var url     = window.location.origin + window.location.pathname + '?country=' + encodeURIComponent(country);

			window.location.href = url;
		}
	}

	var $overseasPartners = document.querySelector('.overseas-partners');

	if ( $overseasPartners ) {
		$overseasPartners.addEventListener('click', overseasPartners);
	}

	function overseasPartners() {

		$('.retailer-search input').hide();
		$('.retailer-search select').show();

		$(this).text('UK Retailers');
		$(this).removeClass('overseas-partners');
		$(this).addClass('uk-retailers');

		var $ukRetailers = document.querySelector('.uk-retailers');

		if ( $ukRetailers ) {
			$ukRetailers.removeEventListener('click', overseasPartners);
			$ukRetailers.addEventListener('click', ukRetailers);
		}
	}

	function ukRetailers() {

		$('.retailer-search select').hide();
		$('.retailer-search input').show();

		$(this).text('Overseas Partners');
		$(this).removeClass('uk-retailers');
		$(this).addClass('overseas-partners');

		var $overseasPartners = document.querySelector('.overseas-partners');

		if ( $overseasPartners ) {
			$overseasPartners.removeEventListener('click', ukRetailers);
			$overseasPartners.addEventListener('click', overseasPartners);
		}
	}

	var formEl = document.getElementById('search-form');
	if (formEl) {
		document.getElementById('search-form').onkeydown = function(event) {

			if (event.keyCode == 13) {
				event.preventDefault();
				return queryPostCode();
			}
		}
	}

	$('.retailer-search button').on('click', function() {

			return queryPostCode();

	});

});
