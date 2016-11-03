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

		$country = rwmb_meta( 'country', array(), $overseas_query->posts[$i]->ID );
		array_push( $countries, $country );
	}

	sort( $countries );

	$html .= '<div class="retailer-search box-shadow">';
	$html .= '<h2>Filter Retailers</h2>';
	$html .= '<span></span>';
	$html .= '<input type="text" placeholder="Post Code">';

	$html .= '<select>';
	$html .= '<option selected disabled">Select a Country</option>';

	for ( $i2 = 0; $i2 < count( $countries ); $i2++ ) {
		$html .= '<option value="' . strtolower( $countries[$i2] ) . '">' . $countries[$i2] . '</option>';
	}

	$html .= '</select>';

	$html .= '<button type="button">Search</button>';
	$html .= '<p class="overseas-partners">Overseas Partners</p>';
	$html .= '</div>';

	return $html;
}

add_shortcode( 'retailer-search-box', 'retailer_search_box' );