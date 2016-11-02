<?php

/**
 * Template Name: Retailer Card
 * The cards on the Find a Retailer page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function retailer_card( $atts = '' ) {

	$html = '';

	$post_id = false;

	if ( is_array( $atts ) && array_key_exists( 'id', $atts ) ) {
		$post_id = $atts['id'];
	}

	if ( !$post_id ) {
		return $html;
	}

	$distance = false;

	if ( array_key_exists( 'distance', $atts ) ) {
		$distance = $atts['distance'];
	}

	$post = get_post( $post_id );

	$address = rwmb_meta( 'address', array(), $post_id );
	$phone   = rwmb_meta( 'phone', array(), $post_id );
	$website = rwmb_meta( 'website', array(), $post_id );
	$email   = rwmb_meta( 'email  ', array(), $post_id );

	$html .= '<div class="retailer">';
	$html .= '<p class="retailer__title">' . get_the_title( $post_id ) . '</p>';
	$html .= '<p class="retailer__address">' . $address . '</p>';
	$html .= '<p class="retailer__phone">' . $phone . '</p>';
	$html .= '<a class="retailer__email" href="mailto:' . $email . '">Send Email</p>';
	$html .= '<a class="retailer_directions" href="#">Get Directions</a>';
	if ( $distance ) {
		$html .= '<h3>' . $distance . ' Miles</h3>';
	}
	$html .= '</div>';

	return $html;
}

add_shortcode( 'retailer-card', 'retailer_card' );