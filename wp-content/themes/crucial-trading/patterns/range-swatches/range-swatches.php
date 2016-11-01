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

function range_swatches( $atts = '' ) {

	$html = '';

	if ( $atts != '' && array_key_exists('material', $atts) ) {

		$material     = $atts['material'];
		$material_cat = get_term_by( 'slug', $material, 'product_cat' );
		$material_id  = $material_cat->term_id;

		$ranges = $all_categories = get_terms( 'product_cat', array(
			'hide_empty' => false,
			'parent'     => $material_id,
		) );
		
		if ( count( $ranges ) > 0 ) :

			echo '<div class="swatches box-shadow clearfix">';

			foreach ( $ranges as $key => $value ) {

				$title = $value->name;
				$link  = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] . $value->slug;

				$src_id = get_woocommerce_term_meta( $value->term_id, 'thumbnail_id', true );
				$src    = wp_get_attachment_url( $src_id );

				echo '<div class="swatch box-shadow">';
				echo '<a href="' . $link  . '" class="no-effect">';
				echo '<h3 class="vertical-align">' . $title . '</h3>';
				echo '<img src="' . $src . '" alt="' . $title . '" class="vertical-align">';
				echo '</a>';
				echo '</div>';
			}

			echo '</div>';

		endif;

		wp_reset_postdata();
	}

	return $html;
}

add_shortcode('range-swatches', 'range_swatches');