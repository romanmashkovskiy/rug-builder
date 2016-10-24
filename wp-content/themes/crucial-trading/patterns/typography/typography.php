<?php

/**
 * Template Name: Typography
 * Text elements showcasing the typography 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function typography_shortcode() {

	$html = '';

	$html .= "<h6>h1.home-banner-header:</h6>";
	$html .= "<h1 class='home-banner-header'>Serenity</h1>";

	$html .= "<h6>h1.standard-banner-header:</h6>";
	$html .= "<h1 class='standard-banner-header'>About Crucial</h1>";

	$html .= "<h6>h1:</h6>";
	$html .= "<h1>About Crucial</h1>";

	$html .= "<h6>h2:</h6>";
	$html .= "<h2>Login</h2>";

	$html .= "<h6>h2.material-header:</h6>";
	$html .= "<h2 class='material-header'>Coir</h2>";

	$html .= "<h6>h3:</h6>";
	$html .= "<h3>Experience Crucial</h3>";

	$html .= "<h6>a:</h6>";
	$html .= "<a href='#' title='Link'>Start Experience</a>";

	$html .= "<h6>p:</h6>";
	$html .= "<p>Use our new 3D rug builder and experience your new creation in all it's glory.</p>";

	return $html;
}

add_shortcode( 'typography', 'typography_shortcode' );