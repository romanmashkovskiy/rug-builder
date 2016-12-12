<?php

/**
 * Template Name: Home Page CTA
 * The CTAs at the bottom of the home page
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function home_page_cta( $atts = '' ) {

	$html = '';

	if ( is_array( $atts ) && array_key_exists( 'id', $atts ) ) {

		$id = (int)$atts['id'];

		if ( $id > 2 || $id < 1 ) {
			return $html;
		}

		$title  = '';
		$text   = '';
		$bg_col = '';
		$src   = '';

		if ( $atts['id'] == 1 ) {

			$title  = 'Find a Retailer';
			$text   = 'Find your nearest Crucial Trading retailer and experience our products first hand.';
			$bg_col = '#383838';
			$src    = get_template_directory_uri() . '/assets/icons/pin.svg';
		}
		else if ( $atts['id'] == 2 ) {

			$title  = 'Order Brochure';
			$text   = 'Use our new immersive 3D rug builder and create your own bespoke luxary.';
			$bg_col = '#343233';
			$src   = get_template_directory_uri() . '/assets/icons/brochure.svg';
		}

		$html .= '<div class="home-page-cta" style="background-color:' . $bg_col . ';">';

		$html .= '<span></span>';
		$html .= '<h2>' . $title . '</h2>';
		$html .= '<p>' . $text . '</p>';
		$html .= '<img src="' . $src . '" alt="' . $title . '">';

		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'home-page-cta', 'home_page_cta' );