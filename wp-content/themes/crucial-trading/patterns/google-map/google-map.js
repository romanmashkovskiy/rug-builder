var $ = jQuery;

$(document).ready(function() {

	if ( $('body').hasClass('page-template-retailer') ) {

		var latLng = {};
		var zoom   = 14
		var $map   = document.getElementById('google-map');

		var ukCenter       = $($map).data('ukcenter');
		var overseasCenter = $($map).data('overseascenter');

		if ( ukCenter !== '' ) {

			var coordArr = ukCenter.split(' ');

			latLng = {
				lat : parseFloat(coordArr[0]),
				lng : parseFloat(coordArr[1])
			};

			zoom = 11;

		} else if ( overseasCenter !== '' ) {

			var coordArr = overseasCenter.split(' ');

			latLng = {
				lat : parseFloat(coordArr[0]),
				lng : parseFloat(coordArr[1])
			};

			zoom = 7;

		} else {

			latLng = {
				lat : 51.475,
				lng : -0.1875
			};

			zoom = 14;
		}

		createMap( latLng, zoom, $map );
	};
});

function createMap( latLng, zoom, $map ) {

	var ukOrOverseas = $($map).data('ukcenter') !== '' ? 'uk' : 'overseas';

	var coordStr    = $($map).data('coordinates');
	var coordinates = coordStr && coordStr !== '' ? coordStr.split('|') : false;

	var overseas    = $($map).data('overseas');
	var coordinates = overseas && overseas !== '' ? overseas.split('|') : false;

	var pinCoordsData = $($map).data('pincoords');
	var pinCoordsArr  = pinCoordsData.split(',');

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
		scaledSize : new google.maps.Size(38, 38),
		origin : new google.maps.Point(0, 0),
		anchor : new google.maps.Point(11, 30),
		url    : 'https://d105txpzekqrfa.cloudfront.net/uploads/20161215113733/Combined-Shape-Copy.svg'
	}

	if ( pinCoordsArr.length > 0 ) {

		for ( var i = 0; i < pinCoordsArr.length; i++ ) {

			if ( pinCoordsArr[i] !== '' ) {

				var coordsArr = pinCoordsArr[i].split(' ');
				var lat       = parseFloat(coordsArr[0]);
				var lng       = parseFloat(coordsArr[1]);

				var i2 = ukOrOverseas === 'uk' ? (i+1).toString() : '';

				var marker = new google.maps.Marker({
					position : { lat: lat, lng: lng },
					map      : map,
					icon     : image,
					label    : i2
				});
			}
		}
	}
}
