<?php
/**
 * Template Name: Footer
 * Main Website Footer 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function crucial_footer() {
	
	$html = '';				
	
	$html .=	'
	
	<div class="">
	
	</div>
	
	
	';

	return $html;
}

add_shortcode( 'footer', 'crucial_footer' );