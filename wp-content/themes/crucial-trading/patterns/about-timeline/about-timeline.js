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
	     
				/*var s = skrollr.init({
				render: function(data) {
					//Debugging - Log the current scroll position.
					console.log(data.curTop);
					}
				});*/
	     
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

	// Add pagePilling for Our Processess
	$('.about__scroller__btn:not(.about__scroller__btn--close)').on('click', function() {

		$('body').append('<link id="pillingcss" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pagePiling.js/1.5.4/jquery.pagepiling.min.css">');
		$('body').append('<script id="pillingjs" src="https://cdnjs.cloudflare.com/ajax/libs/pagePiling.js/1.5.4/jquery.pagepiling.min.js"></script>');

		setTimeout(function() {
			$('#pagepilling').pagepiling();
		}, 100)

	});

	$('.about__scroller__btn--close').on('click', function() {

		$('#pillingcss').remove();
		$('#pillingjs').remove();

	});

	$('.about__scroller__start').on('click', function() {

		$.fn.pagepiling.moveTo(1);

		$('body').scrollTop($(window).height());

		$('#pagepilling').show();
		$('#pp-nav').show();

		$('.about__scroller').hide();
		$('.about__timeline').hide();
		$('.about__scroller__btn').hide();
		$('.about__sidetitle').hide();

	});

	$('.scroller__top').on('click', function() {

		$('.about__scroller').show();
		$('.about__timeline').show();
		$('.about__scroller__btn').show();
		$('.about__sidetitle').show();

		$('#pagepilling').hide();
		$('#pp-nav').hide();

		$('body').scrollTop(0);

	});

	$('.section__next').on('click', function() {
		$.fn.pagepiling.moveSectionDown();
	})


});