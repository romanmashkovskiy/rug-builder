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

	$the_material = 'coir';

	function get_range_parent_category( $categories ) {

		foreach ( $categories as $key => $value ) {

			if ( $value->slug == 'range-parent' ) {
				return $key;
			}
		}

		return NULL;
	}

	$html = '';

	$all_categories = get_terms( 'product_cat', array(
		'hide_empty' => false,
	) );

	$range_parent_key = get_range_parent_category( $all_categories );
	$range_parent_id  = $all_categories[$range_parent_key]->term_id;

	$ranges = array();

	foreach ( $all_categories as $key => $value ) {

		if ( $value->parent == $range_parent_id ) {
			array_push( $ranges, $value );
		}
	}

	$ranges_with_material = array();

	foreach ( $ranges as $key => $value ) {

		$range_id   = $value->term_id;
		$range_meta = get_option( "taxonomy_$range_id" );

		$material = is_array( $range_meta ) && array_key_exists( 'material', $range_meta ) ? $range_meta['material'] : false;

		if ( $material == $the_material ) {
			array_push( $ranges_with_material, $value );
		}
	}

	if ( count( $ranges_with_material > 0 ) ) {

		$html .= '<div class="other-ranges box-shadow">';
		$html .= '<ul class="ranges__ul">';

		foreach ( $ranges_with_material as $key => $value ) {

			$name        = $value->name;
			$name_as_arr = explode( ' ', $name );
			$code        = '';

			foreach ( $name_as_arr as $v ) {
				$code .= $v[0];
			}

			$this_thumb_id  = get_woocommerce_term_meta( $value->term_id, 'thumbnail_id', true );
			$src            = wp_get_attachment_url( $this_thumb_id );
			
			$html .= '<li class="range">';
			$html .= '<div>';
			$html .= '<img src="' . $src . '" alt="' . $name . '">';
			$html .= '<h3>' . $name . '</h3>';
			$html .= '<h3>-' . $code . '</h3>';
			$html .= '</div>';
			$html .= '</li>';
		}

		$html .= '</ul>';
		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'other-ranges', 'other_ranges' );