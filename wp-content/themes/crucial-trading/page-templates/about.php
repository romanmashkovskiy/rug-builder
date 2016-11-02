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

echo do_shortcode( '[header]' ); ?> 



<div class="about">
	<div class="about__timeline"></div>
</div>

<?php get_footer();