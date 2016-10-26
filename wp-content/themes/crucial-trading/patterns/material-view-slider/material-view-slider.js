$(document).ready(function() {

	var svgNext = [
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="59px" viewBox="0 0 31 59" version="1.1" class="prev-slide coir">',
		'<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
		'<g id="vivid" transform="translate(-45.000000, -553.000000)" stroke="#7C7C7C">',
		'<g id="vivid" transform="translate(-45.000000, -553.000000)" stroke="#7C7C7C">',
		'<g id="slider-arrow" transform="translate(60.500000, 582.000000) rotate(-180.000000) translate(-60.500000, -582.000000) translate(46.000000, 553.000000)">',
		'<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>',
		'<path d="M0,57.6057312 L28.6057312,29" id="Line"/>',
		'</g>',
		'</g>',
		'</g>',
		'</svg>'
	];

	var svgPrev = [
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="58px" viewBox="0 0 31 58" version="1.1" class="next-slide coir">',
		'<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">',
		'<g id="vivid" transform="translate(-1556.000000, -553.000000)" stroke="#7C7C7C">',
		'<g id="slider-arrow" transform="translate(1557.000000, 553.000000)">',
		'<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>',
		'<path d="M0,57.6057312 L28.6057312,29" id="Line"/>',
		'</g>',
		'</g>',
		'</g>',
		'</svg>'
	];

	var startIndex;

	var spans = document.querySelectorAll('.material-view-slider ul li span');

	for ( var i = 0; i < spans.length; i++ ) {

		if ( spans[i].hasAttribute('data-show') ) {
			startIndex = spans[i].dataset.show;
			break;
		}
	}

	$('.material-view-slider ul#material-view-slider-list').bxSlider({
		startSlide   : startIndex,

		nextText     : svgPrev.join(''),
		prevText     : svgNext.join(''),

		nextSelector : '#material-view-slider-prev',
		prevSelector : '#material-view-slider-next',
		
	});
})