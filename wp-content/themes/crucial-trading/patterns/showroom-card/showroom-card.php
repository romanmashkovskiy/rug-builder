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

	$address_1 = rwmb_meta( 'retailer_address_1', array(), $post_id );
	$address_2 = rwmb_meta( 'retailer_address_2', array(), $post_id );
	$address_3 = rwmb_meta( 'retailer_address_3', array(), $post_id );
	$address_4 = rwmb_meta( 'retailer_address_4', array(), $post_id );
	$address_5 = rwmb_meta( 'retailer_address_5', array(), $post_id );
	$address_6 = rwmb_meta( 'retailer_town', array(), $post_id );
	$address_7 = rwmb_meta( 'retailer_county', array(), $post_id );
	$address_8 = rwmb_meta( 'retailer_postcode', array(), $post_id );

	$address = '';

	if ( $address_1 != '' ) {
		$address .= $address_1;
	}
	if ( $address_2 != '' ) {
		$address .= "\r\n" . $address_2;
	}
	if ( $address_3 != '' ) {
		$address .= "\r\n" . $address_3;
	}
	if ( $address_4 != '' ) {
		$address .= "\r\n" . $address_4;
	}
	if ( $address_5 != '' ) {
		$address .= "\r\n" . $address_5;
	}
	if ( $address_6 != '' ) {
		$address .= "\r\n" . $address_6;
	}
	if ( $address_7 != '' ) {
		$address .= "\r\n" . $address_7;
	}
	if ( $address_8 != '' ) {
		$address .= "\r\n" . $address_8;
	}

	$phone   = rwmb_meta( 'retailer_telephone_1', array(), $post_id );
	$website = rwmb_meta( 'retailer_website', array(), $post_id );
	$email   = rwmb_meta( 'retailer_email', array(), $post_id );
	$country = rwmb_meta( 'retailer_country', array(), $post_id );

	$lat = get_post_meta( $post_id, 'retailer_lat', true );
	$lng = get_post_meta( $post_id, 'retailer_lng', true );
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