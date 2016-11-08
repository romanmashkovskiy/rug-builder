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

function social_post( $atts = '' ) {

	$html = '';

	if ( is_array( $atts ) ) {

		$img   = array_key_exists( 'image', $atts ) ? $atts['image'] : '';
		$time  = array_key_exists( 'time', $atts )  ? $atts['time'] : '';
		$from  = array_key_exists( 'from', $atts )  ? $atts['from'] : '';
		$title = array_key_exists( 'title', $atts ) ? $atts['title'] : '';

		$html .= '<div class="social__post">';
		$html .= '<div style="background-image:url(';
		$html .= "'" . $img . "'";
		$html .= ')" class="box-shadow">';
		$html .= '<div class="border-box"></div>';
		$html .= '<i class="icon-crucial-' . $from . '"></i>';
		$html .= '<div class="info">';
		$html .= '<h2>' . $title . '</h2>';
		$html .= '<h3>' . $time . '</h3>';
		$html .= '</div>';
		$html .= '</div>';
		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'social-post', 'social_post' );