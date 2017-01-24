<?php

/**
 * Template Name: Other Ranges
 * The other ranges section at the bottom of the single product page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function other_ranges( $atts = '' ) {

	$html = '';

	$the_material = 'coir';

	if ( is_array( $atts ) && array_key_exists( 'material', $atts ) && $atts['material'] != '' ) {
		$the_material = $atts['material'];
	}

	$material    = get_term_by( 'slug', $the_material, 'product_cat' );
	$material_id = $material->term_id;
	
	$ranges = get_terms( array(
		'taxonomy'   => 'product_cat',
		'hide_empty' => false,
		'parent'     => $material_id,
	) ); 

	if ( count( $ranges > 0 ) ) {

		shuffle( $ranges );
		$i = 0;

		$html .= '<h1 class="other-ranges-title ' . $the_material . '">Other Ranges</h1>';
		$html .= '<div class="other-ranges">';
		$html .= '<div class="swatches -other-ranges clearfix">';

		foreach ( $ranges as $key => $value ) {

			if ( $i == 6 ) {
				break;
			}

			$name = $value->name;
			$slug = $value->slug;

			$this_thumb_id  = get_woocommerce_term_meta( $value->term_id, 'thumbnail_id', true );
			$src            = wp_get_attachment_url( $this_thumb_id );
			
			$html .= '<div class="swatch">';
			$html .= '<a href="' . site_url() . '/product/' . $slug . '" class="no-effect">';
			$html .= '<h3 class="vertical-align">' . $name . '</h3>';

			if ( $src != '' ) {
				$html .= '<div class="object-fit-container vertical-align">';
				$html .= '<img src="' . $src . '" alt="' . $name . '">';
				$html .= '</div>';
			}

			$html .= '</a>';
			$html .= '</div>';

			$i++;
		}

		$html .= '</div>';
		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'other-ranges', 'other_ranges' );