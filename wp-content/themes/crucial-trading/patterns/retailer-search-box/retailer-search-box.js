var $ = jQuery;

$(document).ready(function() {

	$('.retailer-search button').on('click', function() {

		if ( $('.overseas-partners').length === 1 ) {
			
			var postCode = $('.retailer-search input').val();

			if ( postCode === '' ) {
				alert('Please enter a post code');
				return;
			}

			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({ 
				'address'               : postCode,
				'componentRestrictions' : {
					country: 'UK'
				}
			}, function(result, status) {

				if ( status !== 'OK' ) {
					alert('No');
					return;
				}

				var lat = result[0].geometry.location.lat();
				var lng = result[0].geometry.location.lng();

				$.ajax({
					type : 'GET',
					url  : window.location.origin + window.location.pathname + '?get_retailers=retailer'
				})
				.done(function(result) {
					
					var retailers        = JSON.parse(result);
					var retailersInRange = [];
					
					for ( var i = 0; i < retailers.length; i++ ) {

						var retailer = retailers[i];

						var rLat = retailer.lat;
						var rLng = retailer.lng;

						var distance = distanceBetweenPoints(lat, lng, rLat, rLng);

						if ( distance < 10 ) {

							var distanceRounded = Math.round( distance * 10 ) / 10;
							retailersInRange.push([retailer.ID, distanceRounded.toFixed(0)]);
						}
					}
/*
					var newUrl = window.location.origin + window.location.pathname + '?results=';

					for ( var i2 = 0; i2 < retailersInRange.length; i2++ ) {
						newUrl += retailersInRange[i2][0] + '-' +   retailersInRange[i2][1] + ',';
					}

					newUrl += '&loc=' + encodeURIComponent(postCode);
*/
					var urlBase = window.location.origin + window.location.pathname + '?results=';

					var results = '';

					for ( var i2 = 0; i2 < retailersInRange.length; i2++ ) {
						results += retailersInRange[i2][0] + '-' +   retailersInRange[i2][1] + ',';
					}

					var resultsEnc = window.btoa(results);

					var newUrl = urlBase + resultsEnc;

					newUrl += '&loc=' + encodeURIComponent(postCode);

					window.location.href = newUrl;
				})
				.fail(function(a, b, c) {
					console.log(a)
					console.log(b)
					console.log(c)
				})
			});

		}
		else if ( $('.uk-retailers').length === 1 ) {
			
			var country = $('.retailer-search select').val();

			$.ajax({
				type : 'GET',
				url  : window.location.origin + window.location.pathname + '?get_retailers=overseas'
			})
			.done(function(result) {

				var retailers = JSON.parse(result);
				var retailer;

				for ( var i = 0; i < retailers.length; i++ ) {

					if ( retailers[i].country === country ) {
						retailer = retailers[i];
						break;
					}
				}

				var newUrl   = window.location.origin + window.location.pathname + '?country=' + country + '&id=' + retailer.ID;

				window.location.href = newUrl;
			})
			.fail(function(a, b, c) {
				console.log(a)
				console.log(b)
				console.log(c)
			})
		}			
	});

	document.querySelector('.overseas-partners').addEventListener('click', overseasPartners);

	function overseasPartners() {

		$('.retailer-search input').hide();
		$('.retailer-search select').show();

		$(this).text('UK Retailers');
		$(this).removeClass('overseas-partners');
		$(this).addClass('uk-retailers');

		document.querySelector('.uk-retailers').removeEventListener('click', overseasPartners);
		document.querySelector('.uk-retailers').addEventListener('click', ukRetailers);
	}

	function ukRetailers() {

		$('.retailer-search select').hide();
		$('.retailer-search input').show();

		$(this).text('Overseas Partners');
		$(this).removeClass('uk-retailers');
		$(this).addClass('overseas-partners');

		document.querySelector('.overseas-partners').removeEventListener('click', ukRetailers);
		document.querySelector('.overseas-partners').addEventListener('click', overseasPartners);
	}
});

function distanceBetweenPoints(lat1, lon1, lat2, lon2) {

	var R    = 6371;
	var dLat = deg2rad(lat2-lat1);
	var dLon = deg2rad(lon2-lon1); 
	var a    = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d    = R * c;

	var miles = d * 0.621371;

	return miles;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}