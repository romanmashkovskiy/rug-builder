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

	global $post, $product;

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

	$required_info = array( 'pa_width', 'pa_backing', 'pa_fibre', 'pa_suitability-1', 'pa_suitability-2', 'pa_suitability-3', 'pa_underlay-1', 'pa_underlay-2', 'pa_underlay-3', 'pa_design-1', 'pa_design-2', 'pa_design-3' );

	$post_meta     = get_post_meta( $post_id, '_product_attributes', true );
	$post_info_box = array();

	foreach( $post_meta as $key => $value ) {
		if ( in_array( $key, $required_info ) ) {
			array_push( $post_info_box, $key );
		}
	}

	$width_arr    = wc_get_product_terms( $post_id, 'pa_width', array( 'fields' => 'names' ) );
	$backing_arr  = wc_get_product_terms( $post_id, 'pa_backing', array( 'fields' => 'names' ) );
	$fibre_arr    = wc_get_product_terms( $post_id, 'pa_fibre', array( 'fields' => 'names' ) );
	$suit_1_arr   = wc_get_product_terms( $post_id, 'pa_suitability-1', array( 'fields' => 'names' ) );
	$suit_2_arr   = wc_get_product_terms( $post_id, 'pa_suitability-2', array( 'fields' => 'names' ) );
	$suit_3_arr   = wc_get_product_terms( $post_id, 'pa_suitability-3', array( 'fields' => 'names' ) );
	$under_1_arr  = wc_get_product_terms( $post_id, 'pa_underlay-1', array( 'fields' => 'names' ) );
	$under_2_arr  = wc_get_product_terms( $post_id, 'pa_underlay-2', array( 'fields' => 'names' ) );
	$under_3_arr  = wc_get_product_terms( $post_id, 'pa_underlay-3', array( 'fields' => 'names' ) );

	$width    = array_key_exists( 0, $width_arr ) ? $width_arr[0] : false;
	$backing  = array_key_exists( 0, $backing_arr ) ? $backing_arr[0] : false;
	$fibre    = array_key_exists( 0, $fibre_arr ) ? $fibre_arr[0] : false;
	$suit_1   = array_key_exists( 0, $suit_1_arr ) ? $suit_1_arr[0] : false;
	$suit_2   = array_key_exists( 0, $suit_2_arr ) ? $suit_2_arr[0] : false;
	$suit_3   = array_key_exists( 0, $suit_3_arr ) ? $suit_3_arr[0] : false;
	$under_1  = array_key_exists( 0, $under_1_arr ) ? $under_1_arr[0] : false;
	$under_2  = array_key_exists( 0, $under_2_arr ) ? $under_2_arr[0] : false;
	$under_3  = array_key_exists( 0, $under_3_arr ) ? $under_3_arr[0] : false;

	$_product = wc_get_product( $post_id );
	$price    = $_product->get_price();

	$src       = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'single-post-thumbnail' )[0];
	$src_arr   = array_values( $product->get_gallery_attachment_ids() );
	$src_angle = count( $src_arr ) > 0 ? wp_get_attachment_url( $src_arr[0] ) : '';

	$html .= '<div class="material-view ' . $material . ' box-shadow">';
	$html .= '<div class="material__header">';

		$html .= '<div class="header__back">';
		$html .= '<a href="#">Back to Materials</a>';
		$html .= '</div>';

		$html .= '<div class="header__titles">';
		$html .= '<h1>' . $post_title . '</h1>';
		$html .= '</div>';

		$html .= '<div class="header__links">';
		$html .= '<ul>';
		$html .= '<li><a href="#" onclick="window.print()">Print Factsheet</h3></a></li>';
//		$html .= '<li><a href="#">Get a Quote</a></li>';
		$html .= '<li><a href="' . site_url() . '/rugbuilder">Rug Builder</a></li>';
		$html .= '<li><a href="#" data-product-id="' . $post_id . '" data-product-name="' . $post_title . '" id="add-swatch-to-basket">Order Swatch</a></li>';
		$html .= '</ul>';
		$html .= '</div>';

	$html .= '</div>';
	$html .= '<div class="material__body">';

		$html .= '<div class="image-container">';
		$html .= '<img src="' . $src . '" alt="' . $post_title . '" class="material-img">';
		$html .= '<a href="#" id="change-image-view" data-view="top" data-top="' . $src . '" data-angle="' . $src_angle . '">Change View</a>';

		if ( $width || $backing || $fibre || $suit_1 || $suit_2 || $suit_3 || $under_1 || $under_2 || $under_3 || $design_1 || $design_2 || $design_3 ) {
			$html .= '<div class="material__details clearfix">';
			$html .= '<a href="#" class="hide-material-info" data-state="open">Hide</a>';

			if ( $fibre ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-"></i>';
				$html .= '<h3>' . $fibre . '</h3>';
				$html .= '</div>';
			}

			if ( $price ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-metres"></i>';
				$html .= '<h3>£' . $price . '</h3>';
				$html .= '</div>';
			}

			if ( $width ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-measurement"></i>';
				$html .= '<h3>' . $width . '</h3>';
				$html .= '</div>';
			}

			if ( $backing ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-"></i>';
				$html .= '<h3>' . $backing . '</h3>';
				$html .= '</div>';
			}

			if ( $under_1 ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-underlay"></i>';
				$html .= '<h3>' . $under_1 . '</h3>';
				$html .= '</div>';
			}

			if ( $under_2 ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-underlay"></i>';
				$html .= '<h3>' . $under_2 . '</h3>';
				$html .= '</div>';
			}

			if ( $under_3 ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-underlay"></i>';
				$html .= '<h3>' . $under_3 . '</h3>';
				$html .= '</div>';
			}

			if ( $suit_1 ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-"></i>';
				$html .= '<h3>' . $suit_1 . '</h3>';
				$html .= '</div>';
			}

			if ( $suit_2 ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-"></i>';
				$html .= '<h3>' . $suit_2 . '</h3>';
				$html .= '</div>';
			}

			if ( $suit_3 ) {
				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-"></i>';
				$html .= '<h3>' . $suit_3 . '</h3>';
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