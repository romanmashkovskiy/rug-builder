var $ = jQuery;

$(document).ready(function() {

	if ( $('body').hasClass('page-template-retailer') ) {

		var $map = document.getElementById('google-map');

		var loc     = $($map).data('loc');
		var country = $($map).data('country');

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
		else if ( country !== '' ) {

			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({ 
				'address'               : country
			}, function(result, status) {

				var latLng = status === 'OK' ? { lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng() } : { lat: 51.475, lng: -0.1875 };
				var zoom   = status === 'OK' ? 7 : 14;

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
	}
});

// http://localhost:8888/crucial-trading/wp-content/uploads/Combined-Shape-Copy.svg

function createMap( latLng, zoom, $map ) {

	var coordStr    = $($map).data('coordinates');
	var coordinates = coordStr && coordStr !== '' ? coordStr.split('|') : false;

	var overseas = $($map).data('overseas');
	var coordinates = overseas && overseas !== '' ? overseas.split('|') : false;

	var map = new google.maps.Map($map, {
		center           : latLng,
		zoom             : zoom,
		disableDefaultUI : true,
		zoomControl      : true,
		scrollwheel      : false
	});

	var styles = [
		{
			stylers: [
				{ hue        : '#64B253' },
				{ saturation : -80 }
			]
		}
	];

	map.setOptions({ styles: styles });

	var image = {
		scaledSize : new google.maps.Size(22, 30),
		origin : new google.maps.Point(0, 0),
		anchor : new google.maps.Point(11, 30),
		url    : 'http://d105txpzekqrfa.cloudfront.net/uploads/20161215113733/Combined-Shape-Copy.svg'
	}

	if ( coordinates ) {

		for ( var i = 0; i < coordinates.length; i++ ) {

			if ( coordinates[i] !== '' && coordinates[i] !== '0,0' ) {

				var comma = coordinates[i].indexOf(',');

				var lat = parseFloat(coordinates[i].substring(0, comma));
				var lng = parseFloat(coordinates[i].substring(comma + 1, coordinates[i].length));

				var marker = new google.maps.Marker({
					position : { lat: lat, lng: lng },
					map      : map,
					icon     : image
				});
			}
		}
	}
	else if ( overseas && overseas !== '' ) {
		
		var marker = new google.maps.Marker({
			position : latLng,
			map      : map,
			icon     : image
		});
	}
}