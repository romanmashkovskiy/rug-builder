/**
 * main-menu.js
 * 
 * jQuery for the main slide out menu 
 */

	// Add active tag and show menu to body	
	$(function() {                     
	  $(".main-menu__button").click(function() { 
	    $(this).toggleClass("is-active");
	    $('body').toggleClass("show-menu");     
	  });
	});
		
	// Remove classes when page clicked 	
	$("html").click(function() {
		$('body').removeClass("show-menu");
		$('.main-menu__button').removeClass("is-active");
	});
	
	// Ignore above for menu and menu button 
	$('.main-menu, .main-menu__button').click(function(event){
	    event.stopPropagation();
	});