<?php

/**
 * Template Name: Material
 * The section on the materials home page
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function material( $atts = '' ) {

	$html = '';

	if ( is_array( $atts ) && array_key_exists( 'material', $atts ) ) {

		$material = $atts['material'];

		$term = get_term_by( 'slug', $material, 'product_cat' );

		$title = ucwords( $material );
		$desc  = $term->description;

		$thumb_id = get_woocommerce_term_meta( $term->term_id, 'thumbnail_id', true );
		$src      = wp_get_attachment_url( $thumb_id );

		$html .= '<div class="material-box clearfix ' . $material . '">';
		$html .= '<div class="material__left">';
		$html .= '<img src="' . $src . '" alt="' . $title . '" class="material__img vertical-align">';
		$html .= '</div>';
		$html .= '<div class="material__right">';
		$html .= '<h1 class="material__title">' . $title . '</h1>';
		$html .= '<p class="material__desc">' . $desc . '</p>';
		$html .= '<a href="' . get_site_url() . '/material/' . $material . '" class="material__link">View Swatches</a>';
		$html .= '</div>';
		$html .= '<span></span>';
		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'material', 'material' );