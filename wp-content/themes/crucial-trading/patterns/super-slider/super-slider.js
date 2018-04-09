$ = jQuery;

var superslidesInterval = setInterval(function() {

	if ( $('#super-slider').length > 0 ) {
		createSuperslider();
	}

}, 1)

function createSuperslider() {

	$('#super-slider').superslides({
		play: 5000,
		animation: 'fade',
		animation_speed: 1200
	});

	clearInterval(superslidesInterval);

}

// Stop Slider when video is started

$(document).ready(function() {

    var video = $('.wp-video-shortcode')[0];

    if ( video ) {

			//console.log('if works');

	    video.addEventListener('playing', function(){
			    $('#super-slider').superslides('stop');
					console.log('stop');
	    })
	     video.addEventListener('pause', function(){
					$('#super-slider').superslides('playing');
					console.log('play');
	    })

    }

});


$(document).ready(function() {

	$('.slide__numbers li').on('click', function() {

		var thisText = $(this).text();
		var index = parseInt(thisText.replace('0', '').replace('.', '')) - 1;

		$('#super-slider').superslides('animate', index)
	});

	$('.slide__arrow--down').on('click', function() {

		var windowHeight = $(window).height();
		var scrollTop    = windowHeight - 50;

		$('body').animate({
			scrollTop: scrollTop
		}, 1100);
	});
});
