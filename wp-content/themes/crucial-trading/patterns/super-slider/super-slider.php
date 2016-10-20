<?php

/**
 * Template Name: Super Slider
 * The large full size slider used on the homepage 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function crucial_slider_slides() {

	$args = array(
		'post_type'   => 'super-slider',
		'post_status' => 'publish',
		'orderby'     => 'menu_order',
	);

	$html = '';

	$query = new WP_Query( $args );

	if ( $query->have_posts() ) :

		$html .= '<div class="super-slider">';
		$html .= '<ul class="slides-container">';

		while ( $query->have_posts() ) : $query->the_post();

			$post_id       = get_the_ID();
			$attachment_id = get_post_thumbnail_id( $post_id );

			$title     = get_the_title();
			$link_url  = rwmb_meta( 'link' );
			$link_text = rwmb_meta( 'link-text' );
			$src       = wp_get_attachment_image_url( $attachment_id, 'full' );
			$srcset    = wp_get_attachment_image_srcset( $attachment_id );
			$alt       = 'Crucial Trading - ' . $link_text;

			$html .= '<li class="slide">';
			$html .= '<img src="' . $src . '" srcset="' . $srcset . '" sizes="100vw" alt="' . $alt . '">';

			$html .= '<div class="slide__left">';
			$html .= '<p><</p>';
			$html .= '<p>' . $title . '</p>';
			$html .= '</div>';

			$html .= '<div class="slide__center">';
			$html .= '<p>' . $title . '</p>';
			$html .= '<a href="' . $link_url . '">' . $link_text . '</a>';
			$html .= '</div>';

			$html .= '<div class="slide__right">';
			$html .= '<p>></p>';
			$html .= '</div>';

			$html .= '<div class="slide__bottom">';
			$html .= '<p>+</p>';
			$html .= '<p>Scroll Down</p>';
			$html .= '</div>';

			$html .= '</li>';

		endwhile;

		$html .= '</ul>';
		$html .= '</div>';

	endif;

	return $html;
}

add_shortcode( 'super-slider', 'crucial_slider_slides' );

echo do_shortcode( '[super-slider]' );