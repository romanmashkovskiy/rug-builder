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

	$html .= '<div class="retailer-search">';
	$html .= '<h2>Filter Retailers</h2>';
	$html .= '<span></span>';
	$html .= '<input type="text" placeholder="Post Code">';
	$html .= '<button type="button">Search</button>';
	$html .= '<p class="overseas-partners">Overseas Partners</p>';
	$html .= '</div>';

	return $html;
}

add_shortcode( 'retailer-search-box', 'retailer_search_box' );