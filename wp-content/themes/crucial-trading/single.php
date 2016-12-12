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

<div class="single-post-container box-shadow">
	<div class="post-title">Author: <?php echo get_the_author(); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php echo get_the_category()[0]->name; ?></div>
	<div class="post-line"></div>
	<?php the_post(); the_content(); ?>
</div>

<?php

echo do_shortcode( '[share-links]' );

get_footer();