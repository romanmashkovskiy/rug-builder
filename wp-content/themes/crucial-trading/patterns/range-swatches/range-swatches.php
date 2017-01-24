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

				$args = array(
					'post_type'   => 'product',
					'tax_query'   => array(
						array(
							'taxonomy' => 'product_cat',
							'field'    => 'term_id',
							'terms'    => $value->term_id,
						)
					)
				);

				$products = new WP_Query( $args );
				$link = '#';

				$title  = $value->name;
				$src_id = get_woocommerce_term_meta( $value->term_id, 'thumbnail_id', true );
				$src    = wp_get_attachment_url( $src_id );

				if ( count( $products->posts ) > 0 ) {

					$site_url  = site_url();
					$title_enc = str_replace( '+', '-', urlencode( strtolower( $title ) ) );

					$link_id  = $products->posts[0]->ID;
					$link     = "$site_url/material/$material/$title_enc?ref=$material";

//					$link     = get_the_permalink( $link_id ) . '?ref=' . urlencode( $material );
				}

				echo '<div class="swatch">';
				echo '<a href="' . $link  . '" class="no-effect">';
				echo '<h3 class="vertical-align">' . $title . '</h3>';

				if ( $src != '' ) {
					echo '<div class="object-fit-container vertical-align">';
					echo '<img src="' . $src . '" alt="' . $title . '">';
					echo '</div>';
				}

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