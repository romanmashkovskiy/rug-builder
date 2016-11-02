<?php

/**
 * Template Name: Google Map
 * The Google Map on the Find a Retailer page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function google_map( $atts = '' ) {

	$html = '<div id="google-map"></div>';

	return $html;
}

add_shortcode( 'google-map', 'google_map' );