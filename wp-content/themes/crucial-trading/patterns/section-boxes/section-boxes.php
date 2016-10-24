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

function section_box( $atts = '' ) {

	wp_reset_postdata();

	$html = '';

	if ( $atts != '' ) {

		$numberMB = array_key_exists('number', $atts) ? $atts['number'] : false;
		$number   = (int)$numberMB;

		if ( $number > -1 ) {

			$boxes = rwmb_meta( 'boxes' );

			if ( count( $boxes ) > 0 ) {

				$box = $boxes[$number];

				$title     = array_key_exists('title', $box) ? $box['title'] : '';
				$subtitle  = array_key_exists('subtitle', $box) ? $box['subtitle'] : '';
				$text      = array_key_exists('text', $box) ? $box['text'] : '';
				$link_text = array_key_exists('link-text', $box) ? $box['link-text'] : '';
				$link      = array_key_exists('link-href', $box) ? $box['link-href'] : '';

				$side  = array_key_exists('side', $box) ? $box['side'] : 'left';
				$image = array_key_exists('image', $box) ? $box['image'][0] : '';

				$src = wp_get_attachment_image_src( $image, 'medium_large' )[0];

				$html .= '<section class="section-box clearfix">';

				$html .= '<div class="box__image ';
				$side == 'left' ? $html .= 'left' : $html .= 'right';
				$html .= '">';
				$html .= '<img src="' . $src . '" alt="' . $subtitle . '">';
				$html .= '</div>';

				$html .= '<div class="box__content ';
				$side == 'left' ? $html .= 'left' : $html .= 'right';
				$html .= '">';
				$html .= '<h3>' . $subtitle . '</h3>';
				$html .= '<h1>' . $title . '</h1>';
				$html .= '<span></span>';
				$html .= '<p>' . $text . '</p>';
				$html .= '<a href="' . $link . '">' . $link_text . '</a>';
				$html .= '</div>';

				$html .= '</section>';
			}
		}
	}

	return $html;
}

add_shortcode('section-boxes', 'section_box');