var sliderInterval = setInterval(function() {

	if ( document.querySelectorAll('.material-view-slider ul li').length > 0 && $('.slidee').length > 0 && $('.material-view-slider ul#material-view-slider-list').length > 0 ) {
		startSlider();
	}

}, 1)

function startSlider() {

	var svgPrev = [
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="59px" viewBox="0 0 31 59" version="1.1" class="prev-slide coir">',
		'<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square" stroke="#7C7C7C">',
		'<g id="vivid" transform="translate(-45.000000, -553.000000)" stroke="#7C7C7C">',
		'<g id="slider-arrow" transform="translate(60.500000, 582.000000) rotate(-180.000000) translate(-60.500000, -582.000000) translate(46.000000, 553.000000)"  stroke="#7C7C7C">',
		'<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>',
		'<path d="M0,57.6057312 L28.6057312,29" id="Line"/>',
		'</g>',
		'</g>',
		'</g>',
		'</svg>'
	];

	var svgNext = [
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="58px" viewBox="0 0 31 58" version="1.1" class="next-slide coir">',
		'<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square" stroke="#7C7C7C">',
		'<g id="vivid" transform="translate(-1556.000000, -553.000000)" stroke="#7C7C7C">',
		'<g id="slider-arrow" transform="translate(1557.000000, 553.000000)"  stroke="#7C7C7C">',
		'<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>',
		'<path d="M0,57.6057312 L28.6057312,29" id="Line"/>',
		'</g>',
		'</g>',
		'</g>',
		'</svg>'
	];

	var startIndex;

	var spans = document.querySelectorAll('.material-view-slider ul li');

	for ( var i = 0; i < spans.length; i++ ) {

		if ( spans[i].hasAttribute('data-show') ) {
			startIndex = spans[i].dataset.show;
			break;
		}
	}

	var slider;

	if ( $('.slidee').data('total') > 1 ) {

		slider = $('.material-view-slider ul#material-view-slider-list').bxSlider({
			mode         : 'fade',
			startSlide   : startIndex,

			nextSelector : '#material-view-slider-next', 
			prevSelector : '#material-view-slider-prev',

			onSliderLoad : function() {
				var slideHeight = $('.slidee[data-show]').height();
				$('.material-view-slider').css('min-height', slideHeight + 'px');
			},

			onSlideNext  : function() {

				var current = $('#material-view-slider-prev-text h3').data('current');
				var total   = $('#material-view-slider-prev-text h3').data('total');

				var newCurrent = current + 1;

				if ( newCurrent === total + 1 ) {
					newCurrent = 1;
				}

				var newNext = newCurrent + 1;
				var newPrev = newCurrent - 1;

				if ( newPrev === 0 ) {
					newPrev = total;
				}

				if ( newNext === total + 1 ) {
					newNext = 1;
				}

				$('#material-view-slider-prev-text h3').text(newPrev + '/' + total);
				$('#material-view-slider-next-text h3').text(newNext + '/' + total);

				$('#material-view-slider-prev-text h3').data('current', newCurrent);

				var newSlideIndex = this.getCurrentSlide();
				var newSlide      = $('#material-view-slider-list').children()[ newSlideIndex ];
				var slideHeight   = $(newSlide).height();
				$('.material-view-slider').css('min-height', slideHeight + 'px');

				var newSlug       = $(newSlide).data('slug');
				var currentUrl    = window.location.href;
				var swatchesIndex = currentUrl.indexOf('/swatches');
				var swatchesEnd   = swatchesIndex + 10;
				var endSubstr     = currentUrl.substr(swatchesEnd);
				var slashIndex    = endSubstr.indexOf('/');
				var urlEnd        = swatchesEnd + slashIndex + 1;
				var urlBase       = currentUrl.substr(0, urlEnd);
				var newUrl        = urlBase + newSlug + '/';

				window.history.pushState(null, '', newUrl);
			},

			onSlidePrev  : function() {

				var current = $('#material-view-slider-prev-text h3').data('current');
				var total   = $('#material-view-slider-prev-text h3').data('total');

				var newCurrent = current - 1;

				if ( newCurrent === 0 ) {
					newCurrent = total;
				}

				var newNext = newCurrent + 1;
				var newPrev = newCurrent - 1;

				if ( newPrev === 0 ) {
					newPrev = total;
				}

				if ( newNext === total + 1 ) {
					newNext = 1;
				}

				$('#material-view-slider-prev-text h3').text(newPrev + '/' + total);
				$('#material-view-slider-next-text h3').text(newNext + '/' + total);

				$('#material-view-slider-prev-text h3').data('current', newCurrent);

				var newSlideIndex = this.getCurrentSlide();
				var newSlide      = $('#material-view-slider-list').children()[ newSlideIndex ];
				var slideHeight   = $(newSlide).height();
				$('.material-view-slider').css('min-height', slideHeight + 'px');

				var newSlug       = $(newSlide).data('slug');
				var currentUrl    = window.location.href;
				var swatchesIndex = currentUrl.indexOf('/swatches');
				var swatchesEnd   = swatchesIndex + 10;
				var endSubstr     = currentUrl.substr(swatchesEnd);
				var slashIndex    = endSubstr.indexOf('/');
				var urlEnd        = swatchesEnd + slashIndex + 1;
				var urlBase       = currentUrl.substr(0, urlEnd);
				var newUrl        = urlBase + newSlug + '/';

				window.history.pushState(null, '', newUrl);
			},
		});
	}

	window.onpopstate = function(e) {
		
		var currentUrl    = window.location.href;
		var swatchesIndex = currentUrl.indexOf('/swatches');
		var swatchesEnd   = swatchesIndex + 10;
		var endSubstr     = currentUrl.substr(swatchesEnd);
		var slashIndex    = endSubstr.indexOf('/');
		var urlEnd        = swatchesEnd + slashIndex + 1;
		var newMaterial   = currentUrl.substring(urlEnd, currentUrl.length - 1);
		var newMatIndex   = $('.slidee[data-slug="' + newMaterial + '"]').data('index');
		
		slider.goToSlide(newMatIndex);
	}

	$('.range__goto').on('click', function(e) {

		e.preventDefault();
		e.stopPropagation();

		var index = $(this).parent().data('index');

		slider.goToSlide(index);

		var newSlideIndex = slider.getCurrentSlide();
		var newSlide      = $('#material-view-slider-list').children()[ newSlideIndex ];
		var newSlug       = $(newSlide).data('slug');
		var currentUrl    = window.location.href;
		var swatchesIndex = currentUrl.indexOf('/swatches');
		var swatchesEnd   = swatchesIndex + 10;
		var endSubstr     = currentUrl.substr(swatchesEnd);
		var slashIndex    = endSubstr.indexOf('/');
		var urlEnd        = swatchesEnd + slashIndex + 1;
		var urlBase       = currentUrl.substr(0, urlEnd);
		var newUrl        = urlBase + newSlug + '/';

		window.history.pushState(null, '', newUrl);

		return false;
	})

	$('.bx-prev').addClass('no-effect');
	$('.bx-next').addClass('no-effect');

	$('.bx-prev').html(svgPrev.join(''));
	$('.bx-next').html(svgNext.join(''));

	clearInterval(sliderInterval);

};