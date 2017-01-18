var $ = jQuery;

$(document).ready(function() {

	$('#basket-link').on('click', function(e) {
		e.preventDefault();
  		e.stopPropagation();
  		document.querySelector('.basket-dropdown').style.display = 'block';
	})

	$('.close-basket-dropdown').on('click', function() {
		document.querySelector('.basket-dropdown').style.display = 'none';
	});
});