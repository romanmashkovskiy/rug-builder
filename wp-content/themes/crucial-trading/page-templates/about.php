<?php
/**
 * Template Name: About
 *
 * Creates the animated interactive about page
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
get_header();

echo do_shortcode( '[logo-nav]' );

//echo do_shortcode( '[header]' ); ?> 



<div class="about">
	

	
	<div class="about__timeline">
		<div class="vertical-align">
			<h3 class="side-title rotate">About Crucial Trading</h3>
			<h3 class="subtitle"></h3>
			<h1 class="vertical-align">Our Story</h1>
			<a href="" title="Our Story">Read More</a>
		</div>
	</div>
	
	<div class="about__scroller">
		<div class="vertical-align">
			<h3 class="subtitle"></h3>
			<h1 class="vertical-align">Our Process</h1>
			<a href="" title="Our Process">Read More</a>
		</div>
	</div>

</div>


<?php get_footer();