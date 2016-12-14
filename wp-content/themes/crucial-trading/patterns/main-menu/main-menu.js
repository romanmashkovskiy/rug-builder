/**
 * main-menu.js
 * 
 * jQuery for the main slide out menu 
 */

jQuery( document ).ready(function() {

var $ = jQuery;
	
	// Add classes - active tag to button and show menu to body	
	$(function() {                     
	  $(".main-menu__button").click(function(e) { 

	  	if ( !$(e.target).hasClass('link-opener') ) {
	  		$(this).toggleClass("is-active");
		    $('body').toggleClass("show-menu");
	  	} else {
	  		e.preventDefault();
	  		e.stopPropagation();
	  		document.querySelector('.basket-dropdown').style.display = 'block';
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

async function read () {
  var html = await getRandomPonyFooArticle();
  var md = hget(html, {
    markdown: true,
    root: 'main',
    ignore: '.at-subscribe,.mm-comments,.de-sidebar'
  });
  var txt = marked(md, {
    renderer: new Term()
  });
  console.log(txt);
}