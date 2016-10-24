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

			while ( $query->have_posts() ) : $query->the_post();

			echo '<pre>';
			print_r($query->the_post());
			echo '</pre>';

			endwhile;
		endif;

		wp_reset_postdata();
	}

	return $html;
}

add_shortcode('material-swatches', 'material_swatches');