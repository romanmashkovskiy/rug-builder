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
	    
		    $(".is-active").click(function() {
				  $('body').toggleClass("hide-about-timeline");
			  });
	     
				var s = skrollr.init({
				render: function(data) {
					//Debugging - Log the current scroll position.
					console.log(data.curTop);
					}
				});
	     
	  });
	});
	
	// Add classes for scroller
	$(function() {                     
	  $(".about__scroller__btn").click(function() { 
	    $(this).toggleClass("is-active");
	    $('body').toggleClass("show-about-scroller");     
	    
	    $(".is-active").click(function() {
			  $('body').toggleClass("hide-about-scroller");
		  });
	    
	  });
	});
/*
 var s = skrollr.init({
      render: function(data) {
          //Debugging - Log the current scroll position.
          console.log(data.curTop);
      }
  });
*/
});