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

	$uk_center       = '';
	$overseas_center = '';

	if ( is_array( $atts ) ) {
		$uk_center       = array_key_exists( 'uk-center', $atts ) ? $atts['uk-center'] : '';
		$overseas_center = array_key_exists( 'overseas-center', $atts ) ? $atts['overseas-center'] : '';
		$pin_coords      = array_key_exists( 'pin-coords', $atts ) ? $atts['pin-coords'] : '';
	}

	$html = '<div id="google-map" data-ukcenter="' . $uk_center . '" data-overseascenter="' . $overseas_center . '" data-pincoords="' . $pin_coords . '"></div>';

	return $html;
}

add_shortcode( 'google-map', 'google_map' );