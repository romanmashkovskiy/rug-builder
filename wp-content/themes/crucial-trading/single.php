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

?>

<div class="single-post-container box-shadow">
	<div class="post-title"><?php the_title(); ?></div>
	<div class="post-line"></div>
	<?php the_post(); the_content(); ?>
</div>

<?php

echo do_shortcode( '[share-links]' );

get_footer();