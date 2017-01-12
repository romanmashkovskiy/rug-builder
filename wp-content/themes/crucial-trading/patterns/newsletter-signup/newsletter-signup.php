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
	$html .= '<div class="newsletter__container">';
	$html .= '<h3 class="rotated-text vertical-align">Stay up to date</h3>';
	$html .= '<span class="newsletter__line"></span>';
	$html .= '<h2>Keep up to date with Crucial</h2>';

	/* NEED MAILCHIMP INPUT */

//	$html .= '<form>';
//	$html .= '<input type="email" placeholder="Enter your email address...">';
//	$html .= '<button type="button">Subscribe</button>';
//	$html .= '</form>';

	$html .= '<form action="//crucial-trading.us14.list-manage.com/subscribe/post?u=87904d618464b14e7cc55dafa&amp;id=ba536732e6" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>';
	$html .= '<div id="mc_embed_signup_scroll">';

	$html .= '<div class="mc-field-group">';
	$html .= '<input type="email" value="" name="EMAIL" class="required email" placeholder="Enter your email address" id="mce-EMAIL" style="width:100%!important;">';
	$html .= '</div>';

	$html .= '<div id="mce-responses" class="clear">';
	$html .= '<div class="response" id="mce-error-response" style="display:none"></div>';
	$html .= '<div class="response" id="mce-success-response" style="display:none"></div>';
	$html .= '</div>';

	$html .= '<div style="position: absolute; left: -5000px;" aria-hidden="true">';
	$html .= '<input type="text" name="b_87904d618464b14e7cc55dafa_ba536732e6" tabindex="-1" value="">';
	$html .= '</div>';

	$html .= '<div class="clear">';
	$html .= '<input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button">';
	$html .= '</div>';

	$html .= '</div>';
	$html .= '</form>';

	$html .= '<style>.mce_inline_error{color:#3d3d3d!important;}</style>';
	$html .= '<script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script>';
	$html .= '<script type="text/javascript">(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]="EMAIL";ftypes[0]="email";fnames[1]="FNAME";ftypes[1]="text";fnames[2]="LNAME";ftypes[2]="text";}(jQuery));var $mcj = jQuery.noConflict(true);</script>';
	
	$html .= '</div></div>';

	return $html;
}

add_shortcode( 'newsletter-signup', 'newsletter_signup' );