var $ = jQuery;

$(document).ready(function() {
	$('.close-basket-dropdown').on('click', function() {
		document.querySelector('.basket-dropdown').style.display = 'none';
	});
});