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

function material_view( $atts = '' ) {

	global $post;

	if ( $atts != '' && array_key_exists( 'post_id', $atts ) ) {
		$post_id = $atts['post_id'];
		$post    = get_post( $post_id );
	}

	$material = 'wool';

	if ( $atts != '' && array_key_exists( 'material', $atts ) ) {
		$material = $atts['material'];
	}

	$html = '';
	
	$post_title = get_the_title();

	$post_meta     = get_post_meta( $post_id, '_product_attributes', true );
	$meta_code     = is_array( $post_meta ) && array_key_exists( 'code', $post_meta ) ? $post_meta['code'] : false;
	$meta_size     = is_array( $post_meta ) && array_key_exists( 'size', $post_meta ) ? $post_meta['size'] : false;
	$meta_price    = is_array( $post_meta ) && array_key_exists( 'price', $post_meta ) ? $post_meta['price'] : false;
	$meta_material = is_array( $post_meta ) && array_key_exists( 'material', $post_meta ) ? $post_meta['material'] : false;
	$meta_underlay = is_array( $post_meta ) && array_key_exists( 'underlay', $post_meta ) ? $post_meta['underlay'] : false;

	$post_code     = $meta_code && array_key_exists( 'value', $meta_code ) ? $meta_code['value'] : false;
	$post_size     = $meta_size && array_key_exists( 'value', $meta_size ) ? $meta_size['value'] : false;
	$post_price    = $meta_price && array_key_exists( 'value', $meta_price ) ? $meta_price['value'] : false;
	$post_material = $meta_material && array_key_exists( 'value', $meta_material ) ? $meta_material['value'] : false;	
	$post_underlay = $meta_underlay && array_key_exists( 'value', $meta_underlay ) ? $meta_underlay['value'] : false;

	$src = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'single-post-thumbnail' )[0];

	$html .= '<div class="material-view ' . $material . ' box-shadow">';
	$html .= '<div class="material__header">';

		$html .= '<div class="header__back">';
		$html .= '<a href="#">Back to Materials</a>';
		$html .= '</div>';

		$html .= '<div class="header__titles">';
		$html .= '<h1>' . $post_title . '</h1>';
		if ( $post_code ) {
			$html .= '<h3>Code: ' . $post_code . '</h3>';
		}
		$html .= '</div>';

		$html .= '<div class="header__links">';
		$html .= '<ul>';
		$html .= '<li><a href="#">Print Factsheet</h3></a></li>';
		$html .= '<li><a href="#">Get a Quote</a></li>';
		$html .= '<li><a href="#">Rug Builder</a></li>';
		$html .= '<li><a href="#">Order Swatch</a></li>';
		$html .= '</ul>';
		$html .= '</div>';

	$html .= '</div>';
	$html .= '<div class="material__body">';

		$html .= '<div class="image-container">';
		$html .= '<img src="' . $src . '" alt="' . $post_title . '" class="material-img">';
		$html .= '<a href="#" id="change-image-view">Change View</a>';

		if ( $post_material || $post_price || $post_size || $post_underlay ) {
			$html .= '<div class="material__details clearfix">';
			$html .= '<a href="#" class="hide-material-info" data-state="open">Hide</a>';
			if ( $post_material ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-basket"></i>';
				$html .= '<h3>' . $post_material . '</h3>';
				$html .= '</div>';
			}
			if ( $post_price ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-metres"></i>';
				$html .= '<h3>' . $post_price . '</h3>';
				$html .= '</div>';
			}
			if ( $post_size ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-measurement"></i>';
				$html .= '<h3>' . $post_size . '</h3>';
				$html .= '</div>';
			}
			if ( $post_underlay ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-underlay"></i>';
				$html .= '<h3>' . $post_underlay . '</h3>';
				$html .= '</div>';
			}
			$html .= '</div>';
		}

		$html .= '</div>';

	$html .= '</div>';
	$html .= '</div>';

	if ( $atts != '' && array_key_exists( 'post_id', $atts ) ) {
		wp_reset_postdata();
	}

	return $html;
}

add_shortcode( 'material-view', 'material_view' );