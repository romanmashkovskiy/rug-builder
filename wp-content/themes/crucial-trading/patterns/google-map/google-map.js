var $ = jQuery;

$(document).ready(function() {

	var $map = document.getElementById('google-map');

	var latLng = {
		lat: 51.475, 
		lng: -0.1875
	};

	var map = new google.maps.Map($map, {
		center           : latLng,
		zoom             : 14,
		disableDefaultUI : true,
		zoomControl      : true
	});

	window.getGoogleMap = function() {
		return map;
	}
});