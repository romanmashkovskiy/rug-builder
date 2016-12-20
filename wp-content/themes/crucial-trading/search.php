<?php
/**
 * The template for displaying search results pages.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package Crucial_Trading
 */

get_header();

echo do_shortcode( '[header search="' . get_search_query() . '"]' );

echo do_shortcode( '[logo-nav]' );

		if ( have_posts() ) : ?>

			<div class="contact-select box-shadow">
				<?php get_search_form(); ?>
			</div>

			<?php
			/* Start the Loop */
			while ( have_posts() ) : the_post();

				/**
				 * Run the loop for the search to output the results.
				 * If you want to overload this in a child theme then include a file
				 * called content-search.php and that will be used instead.
				 */
				get_template_part( 'template-parts/content', 'search' );

			endwhile;

			the_posts_navigation();

		else :

			?>

			<div class="contact-select box-shadow">
				<?php get_template_part( 'template-parts/content', 'none' ); ?>
			</div>

			<?php

		endif;

get_footer();