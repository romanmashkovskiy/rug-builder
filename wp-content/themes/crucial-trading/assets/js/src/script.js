$(document).ready(function() {

	$('#user_login').attr('placeholder', 'Username or Email');
	$('#user_pass').attr('placeholder', 'Password');

	if ( $('body').hasClass('page-template-inspiration') ) {

		$('.fts-twitter-link-image').each(function(i, e) {
			$(e).append('<i class="icon-crucial-instagram"></i>')
		});

		$('.fts-instagram-wrapper').each(function(i, e) {
			$(e).append('<i class="icon-crucial-instagram"></i>')
		});

		$('.fts-twitter-text').each(function(i, e) {
			$(e).append('<div class="twitter-shadow"></div>')
		});
	}
});