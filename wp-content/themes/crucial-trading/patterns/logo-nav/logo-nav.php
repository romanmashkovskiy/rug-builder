<?php

/**
 * Template Name: Logo Nav
 * The logo and mav that appear across the top of the site
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function logo_nav_shortcode( $atts = '' ) {

	$abs_style = 'style="position:absolute;"';

	if ( $atts != '' && array_key_exists( 'pattern', $atts ) && $atts['pattern'] == 'true' ) {
		$abs_style = 'style="background:#383838;"';
	}

	$html = '';

	$html .= '<aside class="top-bar" ' . $abs_style . '>';

	$html .= '<div class="top-bar__left vertical-align">';
	$html .= '<img src="' . get_site_url() . '/wp-content/uploads/logo.svg" alt="Crucial Trading - where inspiration begins" class="full-logo">';
	$html .= '<img src="' . get_site_url() . '/wp-content/uploads/logo-mobile.svg" alt="Crucial Trading - where inspiration begins" class="mobi-logo">';
	$html .= '</div>';

	$html .= '<div class="top-bar__right vertical-align">';
	$html .= '<span class="burger">';
	$html .= '<span></span>';
	$html .= '<span></span>';
	$html .= '<span></span>';
	$html .= '</span>';
	$html .= '<h3>Menu</h3>';
	$html .= '</div>';

	$html .= '</aside>';

	return $html;
}

add_shortcode( 'logo-nav', 'logo_nav_shortcode' );