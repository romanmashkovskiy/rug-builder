<?php

/**
 * Template Name: Inspiration Content
 * The menu for the inspiration page
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

require_once( get_template_directory() . '/patterns/inspiration-content/inspiration-content-twitter.php' );
require_once( get_template_directory() . '/patterns/inspiration-content/inspiration-content-insta.php' );

function inspiration_content() {

	$tweets = get_twitter();
	$instas = get_insta();
	$social = array();

	foreach ( $tweets as $key => $tweet ) {
		$tweet->from         = 'Twitter';
		$tweet->created_time = strtotime( $tweet->created_at );
		array_push( $social, $tweet );
	}

	foreach ( $instas as $key => $insta ) {
		$insta->from = 'Insta';
		array_push( $social, $insta );
	}

	function cmp( $a, $b ) {

		if( $a->created_time == $b->created_time ) {
			return 0;
		} 

		return ( $a->created_time > $b->created_time ) ? -1 : 1;
	}

	usort( $social, 'cmp' );

	$html = '';

	$html .= '<div class="inspiration-content">';

	// Social

	$html .= '<div class="inspiration__social">';
	$html .= '<div class="timeline__centre-line"></div>';
	$html .= '<div class="social__posts">';

	foreach ( $social as $key => $social_post ) {

		$image = '';
		$text  = '';
		$time  = '';
		$link  = '';

		if ( $social_post->from == 'Twitter' ) {

			$image = extract_twitter_image( $social_post );

		} else {



		}

		$html .= "<div class='timeline__event' style='z-index:999;'>";
		$html .= "<img src='$image'>";
		$html .= "</div>'";

	}

	$html .= '</div>';
	$html .= '</div>';

	// Photos

	$html .= '</div>';

	return $html;

}

add_shortcode( 'inspiration-content', 'inspiration_content' );