<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Crucial_Trading
 */

get_header();

echo do_shortcode( '[header]' );

echo do_shortcode( '[logo-nav]' );

setup_postdata( $post );

?>

<div class="single-post__container box-shadow">
	
	<!--<div class="post-title"><?php the_title(); ?></div>
	<div class="post-line"></div>-->
	
	<div class="single-post__content">
		<?php the_post(); the_content(); ?>
	</div>

</div>

<?php

//echo do_shortcode( '[share-links]' );

//echo do_shortcode( '[newsletter-signup]' );

get_footer();