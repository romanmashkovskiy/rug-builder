/**
 * about-timeline.js
 * 
 * jQuery for animating and creating the About page
 */

jQuery( document ).ready(function() {

var $ = jQuery;
	
	// Add classes for timeline
	$(function() {                     
	  $(".about__timeline__btn").click(function() { 
	    $(this).toggleClass("is-active");
	    $('body').toggleClass("show-about-timeline");     
	  });
	});
	
// Add classes for scroller
	$(function() {                     
	  $(".about__scroller__btn").click(function() { 
	    $(this).toggleClass("is-active");
	    $('body').toggleClass("show-about-scroller");     
	  });
	});
		
	// Remove classes and close menu when page is clicked 	
	/*$("html").click(function() {
		$('body').removeClass("show-menu");
		$('.main-menu__button').removeClass("is-active");
	});
	
	// Ignore above for menu and menu button 
	$('.main-menu, .main-menu__button').click(function(event){
	    event.stopPropagation();
	});*/

});