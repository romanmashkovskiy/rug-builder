/**
 * main-menu.js
 *
 * jQuery for the main slide out menu
 */

jQuery( document ).ready(function() {

var $ = jQuery;

	// Add classes - active tag to button and show menu to body
	$(function() {

	  	$('.main-menu__button').on('click', function(e) {

	  		$(this).toggleClass("is-active");
		    $('body').toggleClass("show-menu");

		    var collapseHeader = true;

		    if ( $('header').hasClass('collapsed') ) {

		    	$('header').removeClass('collapsed');
		    	collapseHeader = false;

		    }

		    $('.show-menu .main-menu__wrap').css('z-index', '99999');

		    setTimeout(function() {

		    	$('.top-bar').toggleClass('-relative');

		    	if ( collapseHeader && window.innerWidth < 451 ) {

		    		$('header').addClass('collapsed');

		    	}

		    	if ( $('.top-bar').hasClass('apply-dark-background') ) {
		    		$('.top-bar').removeClass('apply-dark-background')
		    	} else {
		    		$('.top-bar').addClass('apply-dark-background')
		    	}

		    	$('.show-menu .main-menu__wrap').css('z-index', '99999');

		    }, 800)


		    if ( window.innerWidth < 993 ) {

		    	if ( $('body').hasClass('show-menu') ) {
		    		$('.top-bar__left').hide();
		    	} else {
		    		setTimeout(function() {
		    			$('.top-bar__left').show();
		    		}, 400)
		    	}

		    }
	  	});
	});

	// Remove classes and close menu when page is clicked
	$("html").click(function() {
		$('body').removeClass("show-menu");
		$('.main-menu__button').removeClass("is-active");
	});

	// Ignore above for menu and menu button
	$('.main-menu, .main-menu__button').click(function(event){
	    event.stopPropagation();
	});
});

$(window).resize(function() {

	if ( $('body').hasClass('show-menu') ) {

		if ( window.innerWidth < 993 ) {
			$('.top-bar__left').hide();
		} else {
			$('.top-bar__left').show();
		}

	}

})
