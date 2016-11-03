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

	$attr_ids = '';

	if ( is_array( $atts ) && array_key_exists( 0, $atts ) ) {
		$attr_ids = unserialize( $atts[0] );
	}

	$ids = is_array( $attr_ids ) ? array_filter( $attr_ids ) : array();

	$coordinates = '';

	for ( $i = 0; $i < count( $ids ); $i++ ) {

		$dash = strpos( $ids[$i], '-' );
		$id   = substr( $ids[$i], 0, $dash );

		$lat = get_post_meta( $id, 'lat', true );
		$lng = get_post_meta( $id, 'lng', true );

		$coordinates .= $lat . ',' . $lng . '|';
	}

	$loc = '';

	if ( is_array( $atts ) && array_key_exists( 'loc', $atts ) ) {
		$loc = $atts['loc'];
	}

	$html = '<div id="google-map" data-coordinates="' . $coordinates . '" data-loc="' . $loc . '"></div>';

	return $html;
}

add_shortcode( 'google-map', 'google_map' );