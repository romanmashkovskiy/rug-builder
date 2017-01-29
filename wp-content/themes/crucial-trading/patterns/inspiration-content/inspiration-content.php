<?php

/**
 * Template Name: Inspiration Content
 * The menu for the inspiration page
 *
 * Contents:
 * Social - Content
 * Social - HTML
 * Photos - Content
 * Photos - HTML
 * Videos - Content
 * Videos - HTML
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

require_once( get_template_directory() . '/patterns/inspiration-content/inspiration-content-twitter.php' );
require_once( get_template_directory() . '/patterns/inspiration-content/inspiration-content-insta.php' );

function inspiration_content() {

	// Social - Content

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

	// Social - HTML

	$html = '';

	$html .= '<div class="inspiration-content">';

	$html .= '<div class="inspiration__social">';
	$html .= '<div class="timeline__centre-line"></div>';
	$html .= '<div class="social__posts clearfix">';

	include get_template_directory() . '/patterns/inspiration-content/inspiration-content-social.php';

	$html .= '</div>';
	$html .= '</div>';

	// Photos - Content

	$photo_args = array(
		'post_type' => 'inspiration',
		'tax_query' => array(
			array(
				'taxonomy' => 'inspiration_type',
				'field'    => 'slug',
				'terms'    => 'room-shot',
			),
		),
		'orderby' => 'menu_order',
		'order'   => 'ASC',
	);

	$photo_query = new WP_Query( $photo_args );
	$photos      = $photo_query->posts;

	// Photos - HTML

	$html .= '<div class="inspiration__photos">';

	include get_template_directory() . '/patterns/inspiration-content/inspiration-content-photos.php';

	$html .= '</div>';

	// Videos - Content

	$video_args = array(
		'post_type' => 'inspiration',
		'tax_query' => array(
			array(
				'taxonomy' => 'inspiration_type',
				'field'    => 'slug',
				'terms'    => 'video',
			),
		),
		'orderby' => 'menu_order',
		'order'   => 'ASC',
	);

	$video_query = new WP_Query( $video_args );
	$videos      = $video_query->posts;

	// Videos - HTML

	$html .= '<div class="inspiration__videos">';

	include get_template_directory() . '/patterns/inspiration-content/inspiration-content-videos.php';

	$html .= '</div>';

	return $html;

}

add_shortcode( 'inspiration-content', 'inspiration_content' );