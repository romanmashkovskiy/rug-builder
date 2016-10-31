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

	function get_range_parent_category( $categories ) {

		foreach ( $categories as $key => $value ) {

			if ( $value->slug == 'range-parent' ) {
				return $key;
			}
		}

		return NULL;
	}

	$html = '';

	$the_material = 'coir';
	$the_range    = 'boucle-bleached';

	if ( is_array( $atts ) ) {

		if ( array_key_exists( 'material', $atts ) ) {
			$the_material = $atts['material'];
		}

		if ( array_key_exists( 'range', $atts ) ) {
			$the_range = $atts['range'];
		}
	}

	$all_categories = get_terms( 'product_cat', array(
		'hide_empty' => false,
	) );

	$range_parent_key = get_range_parent_category( $all_categories );
	$range_parent_id  = $all_categories[$range_parent_key]->term_id;

	$all_ranges = array();

	foreach ( $all_categories as $key => $value ) {

		if ( $value->parent == $range_parent_id ) {
			array_push( $all_ranges, $value );
		}
	}

	$ranges_with_material = array();

	foreach ( $all_ranges as $key => $value ) {

		$range_id   = $value->term_id;
		$range_meta = get_option( "taxonomy_$range_id" );

		$material = is_array( $range_meta ) && array_key_exists( 'material', $range_meta ) ? $range_meta['material'] : false;

		if ( $material == $the_material ) {
			array_push( $ranges_with_material, $value );
		}
	}

	$num_of_ranges = count( $ranges_with_material );

	$current_range_key = NULL;

	foreach ( $ranges_with_material as $key => $value ) {

		if ( $value->slug == $the_range ) {
			$current_range_key = $key;
		}
	}

	$ranges = array();

	if ( !is_null( $current_range_key ) ) {

		array_push( $ranges, $ranges_with_material[$current_range_key] );

		for ( $i = $current_range_key-1; $i > -1; $i-- ) {
			array_splice( $ranges, 0, 0, $ranges_with_material[$i] );
		}

		$cur_ranges_len  = count( $ranges );
		$num_ranges_left = 6 - $cur_ranges_len;

		$cur_ran_key_plus = $current_range_key+1;

		for ( $i2 = $cur_ran_key_plus; $i2 < $cur_ran_key_plus + $num_ranges_left; $i2++ ) {

			if ( isset( $ranges_with_material[$i2] ) ) {
				array_push( $ranges, $ranges_with_material[$i2] );
			}
		}
	}

	if ( count( $ranges > 0 ) ) {

		$html .= '<div class="other-ranges box-shadow">';
		$html .= '<ul class="ranges__ul">';

		foreach ( $ranges as $key => $value ) {

			$name        = $value->name;
			$name_as_arr = explode( ' ', $name );
			$code        = '';

			foreach ( $name_as_arr as $v ) {
				$code .= $v[0];
			}

			$this_thumb_id  = get_woocommerce_term_meta( $value->term_id, 'thumbnail_id', true );
			$src            = wp_get_attachment_url( $this_thumb_id );

			$active = $value->slug == $the_range;

			$active_class = '';
			$bxshdw_class = '';

			if ( $active ) {
				$active_class = 'active';
				$bxshdw_class = 'class="box-shadow"';
			}
			
			$html .= '<li class="range ' . $the_material . ' ' . $active_class . '">';
			$html .= '<div>';
			$html .= '<img src="' . $src . '" alt="' . $name . '" ' . $bxshdw_class . '>';
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