var $ = jQuery;

$(document).ready(function() {

	$('#basket-link').on('click', function(e) {
		e.preventDefault();
  		e.stopPropagation();

  		if ( document.querySelector('.basket-dropdown').classList.contains('open') ) {
  			document.querySelector('.basket-dropdown').classList.remove('open');
  		} else {
  			document.querySelector('.basket-dropdown').classList.add('open');
  		}
	});

	$('.close-basket-dropdown').on('click', function(e) {

		e.preventDefault();
  		e.stopPropagation();

		document.querySelector('.basket-dropdown').classList.remove('open');
	});
});