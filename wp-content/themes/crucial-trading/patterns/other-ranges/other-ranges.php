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

			if ( $value->parent != 0 ) {
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

	$range_abc       = get_term_by( 'slug', $the_range, 'product_cat' );
	$range_parent_id = $range_abc->parent;
	
	$ranges = get_terms( array(
		'taxonomy'   => 'product_cat',
		'hide_empty' => false,
		'parent'     => $range_parent_id,
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

			$active = $value->slug == $the_range;

			$active_class = '';
			$bxshdw_class = '';

			if ( $active ) {
				$active_class = 'active';
				$bxshdw_class = 'class="box-shadow"';
			}
			
			$html .= '<li class="range ' . $the_material . ' ' . $active_class . '">';
			$html .= '<a href="' . site_url() . '/product/' . $slug . '">';
			$html .= '<div class="range__container">';

			if ( $src != '' ) {
				$html .= '<img src="' . $src . '" alt="' . $name . '" ' . $bxshdw_class . '>';
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