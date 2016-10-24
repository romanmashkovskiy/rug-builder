<?php

/**
 * Template Name: Section Boxes
 * The section boxes 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function material_swatches( $atts = '' ) {

	$html = '';

	if ( $atts != '' && array_key_exists('material', $atts) ) {

		$material = $atts['material'];

		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => 16,
			'tax_query'      => array(
				'taxonomy' => 'product_cat',
				'field'    => 'slug',
				'terms'    => $material,
			),
		);

		$query = new WP_Query( $args );
		
		if ( $query->have_posts() ) :

			echo '<div class="swatches clearfix">';

			while ( $query->have_posts() ) : $query->the_post();

			$title = get_the_title();
			$code  = 'WS101';

			$thumb_id = get_post_thumbnail_id( get_the_ID() );
			$src      = wp_get_attachment_image_src( $thumb_id, 'medium' )[0];

			echo '<div class="swatch">';
			echo '<img src="' . $src . '" alt="' . $title . '">';
			echo '<h3>' . $title . '</h3>';
			echo '<h3 class="code">' . $code . '</h3>';
			echo '</div>';

			endwhile;

			echo '</div>';

		endif;

		wp_reset_postdata();
	}

	return $html;
}

add_shortcode('material-swatches', 'material_swatches');