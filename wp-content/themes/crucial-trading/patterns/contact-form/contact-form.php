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
	$html .= do_shortcode( '[gravityform id=1 title=false]' );
	$html .= '</div>';
	$html .= '</div>';

	$html .= '<div id="press" class="clearfix __hidden __noHeight">';
	$html .= '<div class="border-left">';
	$html .= '<h2 class="press__title">Contact Details</h2>';
	$html .= '<h2 class="press__subtitle">Call Rawlins George</h2>';
	$html .= '<p>020 7352 5791</p>';
	$html .= '<h2 class="press__subtitle">Email Rawlins George:</h2>';
	$html .= '<p><a href="mailto:lucinda@rawlinsgeorge.co.uk" class="press__link">lucinda@rawlinsgeorge.co.uk</a></p>';
	$html .= '<p><a href="mailto:hugo@rawlinsgeorge.co.uk" class="press__link">hugo@rawlinsgeorge.co.uk</a></p>';
	$html .= '</div>';
	$html .= '<span class="press__or"><span class="press__or--text">or</span></span>';
	$html .= '<div class="border-right">';
	$html .= do_shortcode( '[gravityform id=2 title=false]' );
	$html .= '</div>';
	$html .= '</div>';

	$html .= '<div id="trade" class="__hidden __noHeight">';
	$html .= '<div class="border-div">';
	$html .= do_shortcode( '[gravityform id=3 title=false]' );
	$html .= '</div>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'contact-form', 'contact_form' );