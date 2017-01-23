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
		$html .= '<div class="other-ranges box-shadow">';
		$html .= '<ul class="ranges__ul">';

		foreach ( $ranges as $key => $value ) {

			if ( $i == 6 ) {
				break;
			}

			$name = $value->name;
			$slug = $value->slug;

			$this_thumb_id  = get_woocommerce_term_meta( $value->term_id, 'thumbnail_id', true );
			$src            = wp_get_attachment_url( $this_thumb_id );
			
			$html .= '<li class="range ' . $the_material . '">';
			$html .= '<a href="' . site_url() . '/product/' . $slug . '">';
			$html .= '<div class="range__container">';

			if ( $src != '' ) {
				$html .= '<img src="' . $src . '" alt="' . $name . '">';
			}
			
			$html .= '<h3>' . $name . '</h3>';
			$html .= '</div>';
			$html .= '</a>';
			$html .= '</li>';

			$i++;
		}

		$html .= '</ul>';
		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'other-ranges', 'other_ranges' );