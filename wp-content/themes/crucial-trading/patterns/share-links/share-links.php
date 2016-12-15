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

	wp_reset_postdata();

	$material = '';

	if ( is_array( $atts ) && array_key_exists( 'material', $atts ) ) {
		$material = $atts['material'];
	}

	$html = '';

	$html .= '<div class="share-links clearfix">';

	$html .= '<div class="share-title rotated-text ' . $material . '">';
	$html .= '<span></span>';
	$html .= '<h3 class="">Share</h3>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-twitter link__icon transition-all"></i>';
	$html .= '<a href="https://twitter.com/intent/tweet?text=Crucial Trading: ' . get_the_title() . ' ' . get_the_permalink() . '" target="_blank" class="link__text">Twitter</a>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-facebook link__icon transition-all"></i>';
	$html .= '<a href="https://www.facebook.com/sharer/sharer.php?u=CrucialTrading:" title="Share on Facebook" class="link__text" target="_blank">Facebook</a>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-tumblr link__icon transition-all"></i>';
	$html .= '<a href="http://www.tumblr.com/share/link?url=' . get_the_permalink() . '" target="_blank" class="link__text">Tumblr</a>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-mail link__icon transition-all"></i>';
	$html .= '<a href="mailto:?subject=Crucial Trading: ' . get_the_title() . '&body=' . get_the_title() . ' ' . get_the_permalink() . '" class="link__text">Email</a>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'share-links', 'share_links' );