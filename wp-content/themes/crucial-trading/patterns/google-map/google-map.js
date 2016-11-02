var $ = jQuery;

$(document).ready(function() {

	var $map = document.getElementById('google-map');

	var loc = $($map).data('loc');

	if ( loc !== '' ) {

		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({ 
			'address'               : loc,
			'componentRestrictions' : {
				country: 'UK'
			}
		}, function(result, status) {

			var latLng = status === 'OK' ? { lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() } : { lat: 51.475, lng: -0.1875 };
			var zoom   = status === 'OK' ? 11 : 14;

			createMap( latLng, zoom, $map );
		});
	}
	else {

		var latLng = {
			lat: 51.475, 
			lng: -0.1875
		};

		createMap( latLng, 14, $map );
	}
});

// http://localhost:8888/crucial-trading/wp-content/uploads/Combined-Shape-Copy.svg

function createMap( latLng, zoom, $map ) {

	var coordStr    = $($map).data('coordinates');
	var coordinates = coordStr !== '' ? coordStr.split('|') : false;

	var map = new google.maps.Map($map, {
		center           : latLng,
		zoom             : zoom,
		disableDefaultUI : true,
		zoomControl      : true
	});

	if ( coordinates ) {

		for ( var i = 0; i < coordinates.length; i++ ) {

			if ( coordinates[i] !== '' ) {

				var comma = coordinates[i].indexOf(',');

				var lat = parseFloat(coordinates[i].substring(0, comma));
				var lng = parseFloat(coordinates[i].substring(comma + 1, coordinates[i].length));

				var marker = new google.maps.Marker({
					position: { lat: lat, lng: lng },
					map: map
				});
			}
		}
	}
}