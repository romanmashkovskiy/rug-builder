<?php

/**
 * Template Name: Newsletter Signup
 * The newsletter signup box
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function newsletter_signup( $atts = '' ) {

	$html = '';

	$html .= '<div class="newsletter">';
	$html .= '<span></span>';
	$html .= '<h3>Stay up to date</h3>';
	$html .= '<h2>Keep up to date with Crucial</h2>';

	/* NEED MAILCHIMP INPUT */

	$html .= '<form>';
	$html .= '<input type="email" placeholder="Enter your email address...">';
	$html .= '<button type="button">Subscribe</button>';
	$html .= '</form>';
	
	$html .= '</div>';

	return $html;
}

add_shortcode( 'newsletter-signup', 'newsletter_signup' );