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

		    setTimeout(function() {
		    	$('.top-bar').toggleClass('-relative');
		    }, 650)
		    

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

