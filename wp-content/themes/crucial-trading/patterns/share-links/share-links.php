<?php

/**
 * Template Name: Material View
 * The detailed view of the material on the material page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function share_links( $atts ) {

	$material = '';

	if ( is_array( $atts ) && array_key_exists( 'material', $atts ) ) {
		$material = $atts['material'];
	}

	$html = '';

	$html .= '<div class="share-links clearfix">';

	$html .= '<div class="share-title ' . $material . '">';
	$html .= '<span></span>';
	$html .= '<h3 class="rotate">Share</h3>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-twitter link__icon transition-all"></i>';
	$html .= '<a href="#" class="link__text">Twitter</a>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-facebook link__icon transition-all"></i>';
	$html .= '<a href="#" class="link__text">Facebook</a>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-tumblr link__icon transition-all"></i>';
	$html .= '<a href="#" class="link__text">Tumblr</a>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-mail link__icon transition-all"></i>';
	$html .= '<a href="#" class="link__text">Email</a>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'share-links', 'share_links' );