<?php

/**
 * Template Name: Retailer Search Box
 * The search box on the Find a Retailer page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function retailer_search_box( $atts = '' ) {

	$html = '';

	$loc = '';

	if ( is_array( $atts ) && array_key_exists( 'loc', $atts ) ) {
		$loc = $atts['loc'];
	}

	$country = '';

	if ( is_array( $atts ) && array_key_exists( 'country', $atts ) ) {
		if ( $atts['country'] != '' ) {
			$country = $atts['country'];
		}
	}

	$overseas_args = array(
		'post_type' => 'retailer',
		'tax_query' => array(
			array(
				'taxonomy' => 'retailer_type',
				'field'    => 'slug',
				'terms'    => 'overseas',
			),
		),
	);

	$overseas_query = new WP_Query( $overseas_args );

	$countries = array();

	for ( $i = 0; $i < $overseas_query->post_count; $i++ ) {
		$this_country = rwmb_meta( 'country', array(), $overseas_query->posts[$i]->ID );
		array_push( $countries, $this_country );
	}

	sort( $countries );

	$html .= '<div class="retailer-search box-shadow">';
	$html .= '<h2>Filter Retailers</h2>';
	$html .= '<span></span>';

	$html .= '<input type="text" placeholder="Post Code" value="' . $loc . '">';

	$html .= '<select>';
	$html .= '<option selected disabled">Select a Country</option>';

	for ( $i2 = 0; $i2 < count( $countries ); $i2++ ) {
		$selected = $country == $countries[$i2] ? 'selected' : '';
		$html .= '<option value="' . $countries[$i2] . '" ' . $selected . '>' . $countries[$i2] . '</option>';
	}

	$html .= '</select>';

	$html .= '<button type="button">Search</button>';
	$html .= '<p class="overseas-partners">Overseas Partners</p>';
	$html .= '</div>';

	if ( $country != '' ) {
		$html .= '<script>jQuery(document).ready(function(){document.querySelector(".overseas-partners").click();});</script>';
	}

	return $html;
}

add_shortcode( 'retailer-search-box', 'retailer_search_box' );