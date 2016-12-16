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

function page_image( $atts = '' ) {

	wp_reset_postdata();

	$html = '';

	$standard_img = rwmb_meta( 'standard_image' );
	$standard_tag = rwmb_meta( 'standard_tag' );
	$other_imgs   = rwmb_meta( 'other_images' );
	$count_other  = count( $other_imgs );

	if ( count( $standard_img ) > 0 ) {

		$image = array_values( $standard_img )[0];

		$src = array_key_exists( 'full_url', $image ) ? $image['full_url'] : '';
		$alt = array_key_exists( 'file', $image ) ? $image['file'] : '';

		$html .= '<div class="page-image">';
		$html .= '<img src="' . $src . '" alt="' . $alt . '" class="page-image__img" data-tag="' . $standard_tag . '">';
	}

	if ( $count_other > 0 ) {

		for ( $i = 0; $i < $count_other; $i++ ) {

			$image_id  = array_key_exists( 'other_image', $other_imgs[$i] ) ? $other_imgs[$i]['other_image'][0] : '';
			$image_src = wp_get_attachment_image_src( $image_id, 'full' )[0];
			$image_tag = array_key_exists( 'image_tag', $other_imgs[$i] ) ? $other_imgs[$i]['image_tag'] : '';

			$html .= '<img src="' . $image_src . '" alt="' . $image_tag . '" class="page-image__img __hidden" data-tag="' . $image_tag . '">';
		}
	}

	if ( count( $standard_img ) > 0 ) {
		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'page-image', 'page_image' );