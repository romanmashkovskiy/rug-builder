<?php

/**
 * Template Name: Section Boxes
 * The section boxes 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function section_box( $atts = ''; ) {

	$html = '';

	if ( $atts != '' ) {

		$number = array_key_exists('number', $atts) ? $atts['number'] : false;

		if ( $number ) {

			$boxes = rwmb_meta( 'boxes' );
			$box   = $boxes[$number];

			echo '<pre>';
			print_r($box);
			echo '</pre>';
		}
	}

	return $html;
}

add_shortcode('section-box', 'section_box');