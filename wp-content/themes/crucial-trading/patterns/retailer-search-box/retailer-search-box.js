var $ = jQuery;

$(document).ready(function() {

	var map = getGoogleMap();

	$('.retailer-search button').on('click', function() {

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
				url  : window.location.href + '?get_retailers=retailer'
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

				var newUrl = window.location.href + '?results=';

				for ( var i2 = 0; i2 < retailersInRange.length; i2++ ) {
					newUrl += retailersInRange[i2][0] + '-' +   retailersInRange[i2][1] + ',';
				}

				window.location.href = newUrl;
			})
			.fail(function(a, b, c) {
				console.log(a)
				console.log(b)
				console.log(c)
			})
		});
	});
});

function distanceBetweenPoints(lat1, lon1, lat2, lon2) {

	var R    = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);
	var dLon = deg2rad(lon2-lon1); 
	var a    = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d    = R * c; // Distance in km

	var miles = d * 0.621371;

	return miles;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}