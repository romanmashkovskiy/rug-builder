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
		var markers = [];
		var infowindows = [];
		var infoBubbles = [];

		for ( var i = 0; i < pinCoordsArr.length; i++ ) {

			if ( pinCoordsArr[i] !== '' ) {

				var coordsArr = pinCoordsArr[i].split(' ');
				var lat       = parseFloat(coordsArr[0]);
				var lng       = parseFloat(coordsArr[1]);

				// Marker value ie number
				var i2 = ukOrOverseas === 'uk' ? (i+1).toString() : '';


				markers[i2] = new google.maps.Marker({
					position : { lat: lat, lng: lng },
					map      : map,
					icon     : image,
					label    : i2,
					title		: "Hello mayne: " + i2
				});



				google.maps.event.addListener(markers[i2], 'click', function(e) {
					var retailerId = "#retailer_" + this.label;
					var title = $(retailerId + " .retailer__title").text();
					console.log(title);

					var contentString = (
						"<div class='g-infowindow'>Hello World</div>"
					)
					infowindows[this.label] = new google.maps.InfoWindow({
	            content: contentString
	        });

					var contantString = "<div id='close' class='g-infobubble'>" +
																"<div class='g-infobubble__container'>" +
																	"<div class='g-infobubble__container__body'>" +
																		"<h4>" + title + "</h4>" +
																		"<p>ddddddd</p>" +
																	"</div>" +
																	"<div class='g-infobubble__container__footer'>" +
																		"<a>Visit Website</a>" +
																		"<a>2 miles</a>" +
																	"</div>" +
																"</div>"
															'<div>';

					infoBubbles[this.label] = new InfoBubble({
			      map: map,
			      content: contantString,
			      shadowStyle: 1,
			      padding: 0,
			      backgroundColor: '#ffffff',
			      borderRadius: 0,
			      arrowSize: 15,
			      //borderWidth: 1,
			      //borderColor: '#2c2c2c',
			      disableAutoPan: true,
			      hideCloseButton: true,
			      arrowPosition: 30,
			      backgroundClassName: 'transparent',
			      arrowStyle: 2,
						maxHeight: 154,
						maxWidth: 395,
						closeSrc: 'https://maps.gstatic.com/intl/en_us/mapfiles/iw_close.gif'
					});


					 infoBubbles[this.label].open(map, markers[this.label]);
				 });
			}
		}
	}
}
