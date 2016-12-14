<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Crucial_Trading
 */

get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[header overlay="true"]' );

//setup_postdata( $post );

?>

<div class="single-post__container box-shadow">
	
	<div class="single-post__meta rotated-text">
		<div class="single-post__meta__author">
			<?php the_author();?>
		</div>
		<div class="single-post__meta__category">
			<?php $news_cat = get_the_category();	echo $news_cat[0]->name; ?>
		</div>
	</div>
	
	<div class="single-post__content">
		<?php the_post(); the_content(); ?>
	</div>

</div>

<?php

echo do_shortcode( '[share-links]' );

echo do_shortcode( '[newsletter-signup]' );

get_footer();