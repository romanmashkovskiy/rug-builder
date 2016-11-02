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
				
				console.log(retailers)
			})
			.fail(function(a, b, c) {
				console.log(a)
				console.log(b)
				console.log(c)
			})
		});
	});
});