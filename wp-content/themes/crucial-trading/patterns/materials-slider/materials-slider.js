var $ = jQuery;

$(document).ready(function() {

	$('.materials-slider').bxSlider();

	$('.material-slide .abc').css('cssText', 'height: calc(100% - 60px)');
});