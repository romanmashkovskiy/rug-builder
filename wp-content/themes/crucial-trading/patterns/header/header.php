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

function header_shortcode($atts = '') {

	$header_size = 'small';

	if ( $atts != '' && array_key_exists('size', $atts) && $atts['size'] == 'large' ) {
		$header_size = 'large';
	}

	$title    = get_the_title();
	$subtitle = rwmb_meta( 'subtitle' );

	$attachment_id = has_post_thumbnail() ? get_post_thumbnail_id() : false;
	$background    = $attachment_id ? wp_get_attachment_image_url( $attachment_id, 'full' ) : '';

	$html = '';

	$html .= '<header class="' . $header_size . '" style="background-image: url(' . $background . ')">';
	$html .= '<h3 class="vertical-align side-title">' . $title . '</h3>';
	$html .= '<h3 class="vertical-align subtitle">' . $subtitle . '</h3>';
	$html .= '<h1 class="vertical-align">' . $title . '</h1>';
	$html .= '</header>';

	return $html;
}

add_shortcode( 'header', 'header_shortcode' );

function header_material_shortcode($atts = '') {

	echo '<style>pre{font-size:20px!important;}</style>';

	$html = '';

	if ( $atts != '' && array_key_exists('material', $atts) ) {

		$material  = $atts['material'];
		$umaterial = ucwords( $atts['material'] );

		$args = array(
			'hide_empty' => false,
			'orderby'    => 'name',
		);

		$categories = get_terms( 'product_cat', $args );

		$this_cat          = get_term_by( 'slug', $material, 'product_cat' );
		$this_cat_post_id  = get_term_meta( $this_cat->term_id, 'thumbnail_id', true );
		$this_cat_thumb    = get_post( $this_cat_post_id )->guid;

		$html .= '<header class="large material clearfix">';

		$html .= '<div class="material__name ' . $material . '">';
		$html .= '<h3>' . $material . '</h3>';
		$html .= '</div>';

		$html .= '<div class="material__icon vertical-align">';
		$html .= '<img src="' . $this_cat_thumb . '" alt="' . $material . '">';
		$html .= '</div>';

		$html .= '<div class="material__info ' . $material . ' vertical-align">';
		$html .= '<h3>True Survivor</h3>';
		$html .= '<h1>' . $umaterial . '</h1>';
		$html .= '<p>' . $this_cat->description . '</p>';
		$html .= '</div>';

		$html .= '<div class="material__sidememu">';
		$html .= '<ul>';

		for ( $i=0; $i<count($categories); $i++ ) {

			$cat  = $categories[$i];
			$post = get_term_meta( $cat->term_id, 'thumbnail_id', true );
			$src  = get_post( $post )->guid;
			$alt  = $cat->slug; 

			$html .= '<li>';
			$html .= '<img src="' . $src . '" alt="' . $alt . '">';
			$html .= '<li>';
		}

		$html .= '</ul>';
		$html .= '</div>';

		$html .= '</header>';
	}

	return $html;
}

add_shortcode( 'header-material', 'header_material_shortcode' );