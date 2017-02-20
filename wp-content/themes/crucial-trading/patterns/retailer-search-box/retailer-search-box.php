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

	if ( is_array( $_GET ) && array_key_exists( 'postcode', $_GET ) ) {
		$loc = $_GET['postcode'];
	}

	$country = '';

	if ( is_array( $_GET ) && array_key_exists( 'country', $_GET ) ) {
		if ( $_GET['country'] != '' ) {
			$country = $_GET['country'];
		}
	}

	$overseas_args = array(
		'post_type' => 'retailer',
		'posts_per_page' => -1,
		'tax_query' => array(
			array(
				'taxonomy' => 'retailer_type',
				'field'    => 'slug',
				'terms'    => 'overseas',
			),
		),
		'ignore_sticky_posts'    => true,
		'no_found_rows'        => true
	);

	$overseas_query = new WP_Query( $overseas_args );

	$countries = array();

	for ( $i = 0; $i < $overseas_query->post_count; $i++ ) {
		$this_country = rwmb_meta( 'retailer_country', array(), $overseas_query->posts[$i]->ID );
		array_push( $countries, strtoupper( $this_country ) );
	}

	sort( $countries );
	$countries = array_unique( $countries );
	$countries = array_values( $countries );

	$html .= '<div class="retailer-search box-shadow">';
	$html .= '<h2>Filter Retailers</h2>';
	$html .= '<span></span>';

	$html .= '<input type="text" placeholder="Post Code" value="' . $loc . '" maxlength="12">';

	$html .= '<select>';
	$html .= '<option selected disabled">Select a Country</option>';

	for ( $i2 = 0; $i2 < count( $countries ); $i2++ ) {

		$country_text  = $countries[$i2];
		$country_lower = strtolower( $country_text );
		$country_cap   = ucwords( $country_lower );

		$selected = $country == $country_lower ? 'selected' : '';
		$html .= '<option value="' . $country_lower . '" ' . $selected . '>' . $country_cap . '</option>';
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