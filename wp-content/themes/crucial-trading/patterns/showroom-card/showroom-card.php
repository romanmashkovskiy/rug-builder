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

	$title = $type == 'showroom' ? 'Crucial Trading - Notting Hill' : 'Online Retailer 1';

	$html .= '<div class="showroom-card ' . $type . '">';
	$html .= '<div class="border-div clearfix">';
	$html .= '<h3 class="card__title">' . $title . '</h3>';
	$html .= '<span class="card__underline"></span>';

	if ( $type == 'showroom' ) {

		$html .= '<p class="card__address">79 Westbourne Park Rd<br>London<br>W25QH</p>';
		$html .= '<div class="card__contact">';
		$html .= '<p class="card__phone">020 7221 9000</p>';
		$html .= '<p class="card__email">Send Email</p>';
		$html .= '</div>';
		$html .= '<a href="#" class="card__link">Get Directions</a>';

	}
	else if ( $type == 'online' ) {

		$html .= "<p class='card__address'>www.onlineretailer1.co.uk</p>";
		$html .= '<p class="card__phone">020 7221 9000</p>';
		$html .= '<p class="card__email">Send Email</p>';
		$html .= '<a href="#" class="card__link">Visit Website</a>';
	}

	$html .= '</div>';
	$html .= '</div>';

	return $html;
}

add_shortcode( 'showroom-card', 'showroom_card' );