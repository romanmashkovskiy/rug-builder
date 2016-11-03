<?php

/**
 * Template Name: Contact Form
 * The contact page form
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function contact_form() {

	$html = '';

	$html .= '<div class="contact-form box-shadow">';

	$html .= '<div id="general">';
	$html .= '<div class="border-div">';

	$html .= '</div>';
	$html .= '</div>';

	$html .= '<div id="press">';
	$html .= '<div class="border-left">';
	$html .= '<h3>Contact Details</h3>';
	$html .= '<h3>Call PR First</h3>';
	$html .= '<p>020 7186 8000</p>';
	$html .= '<h3>Email PR First</h3>';
	$html .= '<p><a href="mailto:tulsi@prfirst.co.uk">tulsi@prfirst.co.uk</a></p>';
	$html .= '<p><a href="mailto:lily@prfirst.co.uk">lily@prfirst.co.uk</a></p>';
	$html .= '<p><a href="mailto:david@prfirst.co.uk">david@prfirst.co.uk</a></p>';
	$html .= '</div>';
	$html .= '<div class="border-right">';
	$html .= '</div>';
	$html .= '</div>';

	$html .= '<div id="trade">';
	$html .= '<div class="border-left">';
	$html .= '</div>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'contact-form', 'contact_form' );