<?php

/**
 * Template Name: Showroom Card
 * The cards used for showrooms and online retailers on the Find a Retailer page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function showroom_card( $atts = '' ) {

	$html = '';

	$type = false;

	if ( is_array( $atts ) && array_key_exists( 'type', $atts ) ) {
		$type = $atts['type'];
	}

	if ( !$type ) {
		return $html;
	}

	$post_id = 0;

	if ( is_array( $atts ) && array_key_exists( 'id', $atts ) ) {
		$post_id = $atts['id'];
	}

	$title = get_the_title( $post_id );

	$address = rwmb_meta( 'address', array(), $post_id );
	$phone   = rwmb_meta( 'phone', array(), $post_id );
	$website = rwmb_meta( 'website', array(), $post_id );
	$email   = rwmb_meta( 'email', array(), $post_id );

	$lat = get_post_meta( $post_id, 'lat', true );
	$lng = get_post_meta( $post_id, 'lng', true );
	$url = 'http://maps.google.com/maps?q=' . $lat . ',' . $lng . '&ll=' . $lat . ',' . $lng . '&z=12';

	$html .= '<div class="showroom-card ' . $type . '">';
	$html .= '<div class="border-div clearfix">';
	$html .= '<h3 class="card__title">' . $title . '</h3>';
	$html .= '<span class="card__underline"></span>';

	if ( $type == 'showroom' ) {

		$html .= '<p class="card__address">' . nl2br( $address ) . '</p>';
		$html .= '<div class="card__contact">';
		$html .= '<p class="card__phone">' . $phone . '</p>';
		$html .= '<a href="mailto:' . $email . '" class="card__email">Send Email</a>';
		$html .= '</div>';
		$html .= '<a href="' . $url . '" class="card__link">Get Directions</a>';

	}
	else if ( $type == 'online' ) {

		$html .= '<p class="card__address">' . $website . '</p>';
		$html .= '<p class="card__phone">' . $phone . '</p>';
		$html .= '<a href="mailto:' . $email . '" class="card__email">Send Email</a>';
		$html .= '<a href="' . $website . '" class="card__link">Visit Website</a>';
	}

	$html .= '</div>';
	$html .= '</div>';

	return $html;
}

add_shortcode( 'showroom-card', 'showroom_card' );