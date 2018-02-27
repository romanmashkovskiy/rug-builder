$(document).ready(function() {

// crucial: http://maps.google.com/maps?saddr=52.50883313,-2.07817228&daddr=ws1 3qu

// movit: http://maps.google.com/maps?saddr=52.508,-1.69351&daddr=52.4826594,-1.8335196
	if ( $('body').hasClass('page-template-retailer') ) {

		// Detect if on overseas page
		const countryParam = window.location.search.substr(1).split('=')[0]

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

		createMap( latLng, zoom, $map, countryParam );
	};
});

function createMap( latLng, zoom, $map, countryParam ) {

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

	$('.switch_views').click(function() {
		$(".js-info-bubble-close").click();
	})

	if ( pinCoordsArr.length > 0 ) {
		var markers = [];
		var infowindows = [];
		var infoBubbles = [];
		for ( var i = 0; i < pinCoordsArr.length; i++ ) {

			if ( pinCoordsArr[i] !== '' ) {

				var coordsArr = pinCoordsArr[i].split(' ');
				var lat       = parseFloat(coordsArr[0]);
				var lng       = parseFloat(coordsArr[1]);

				// Marker value ie number to start from 1
				//var i2 = ukOrOverseas === 'uk' ? (1 + i).toString() : '';
				const i2 = (1 + i).toString();


				markers[i2] = new google.maps.Marker({
					position : { lat: lat, lng: lng },
					map      : map,
					icon     : image,
					label    : i2,
					// title		: "Hello mayne: " + i2
				});
				// google.maps.event.addListener(infoBubbles[i2], 'click', function(e) {
				// 	console.log("clicked")
				// })

				google.maps.event.addListener(markers[i2], 'click', function(e) {
					// Close all other open windows, if open, on each click
					$(".js-info-bubble-close").click();

					infoBubbles[this.label] = new InfoBubble({
			      map: map,
			      content: countryParam == 'country' ? bubbleView(this, 'Overseas Retailer') : bubbleView(this, 'Local Retailer'),
			      shadowStyle: 1,
			      padding: 0,
			      backgroundColor: '#ffffff',
			      borderRadius: 0,
			      arrowSize: 15,
			      //borderWidth: 1,
			      //borderColor: '#2c2c2c',
			      disableAutoPan: true,
			      hideCloseButton: false,
			      arrowPosition: 30,
			      backgroundClassName: 'transparent',
			      arrowStyle: 2,
						//minHeight: 154,
						//maxWidth: 395,
						closeSrc: 'http://www.freeiconspng.com/uploads/close-button-png-27.png'
						//closeSrc: templateDirectoryUri + "/assets/icons/plus.svg"
					});

					infoBubbles[this.label].open(map, markers[this.label]);

				 });
			}
		}
	}

	function bubbleView(this_, pTag) {
		const distance_ = "#distance_" + this_.label;
		const title_ = "#title_" + this_.label;
		const website_ = "#website_" + this_.label;
		const title = $(title_).text();
		const distance = $(distance_).text();
		const website = $(website_).attr('href');
		return contantString = "<div id='close' class='g-infobubble'>" +
													"<div class='g-infobubble__container'>" +
														"<div class='g-infobubble__container__body'>" +
															"<h4>" + title + "</h4>" +
															"<p>" + pTag +"</p>" +
														"</div>" +
														"<div class='g-infobubble__container__footer'>" +
															"<a href='" + website + "'" + ">Get Directions</a>" +
															"<a id='close'>" + distance + "</a>" +
														"</div>" +
													"</div>"
												'<div>';
	}
}
