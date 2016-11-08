<?php

/**
 * Template Name: Contact Select
 * The Select at the top of the contact page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function contact_select() {

	$html = '';

	$html .= '<div class="contact-select box-shadow">';
	$html .= '<h2>How can we help?</h2>';
	$html .= '<span></span>';
	$html .= '<select>';
	$html .= '<option value="general">General enquiry</option>';
	$html .= '<option value="press">Press enquiry</option>';
	$html .= '<option value="trade">Trade enquiry</option>';
	$html .= '</select>';
	$html .= '</div>';

	return $html;
}

add_shortcode( 'contact-select', 'contact_select' );