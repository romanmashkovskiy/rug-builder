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

	$product_terms = get_the_terms( $post_id, 'product_cat' );

	$range_parent = 0;
	$referer      = false;

	if ( array_key_exists( 'range_referer', $_SESSION ) ) {
		$referer = $_SESSION['range_referer'];
	}

	if ( $referer ) {

		foreach ( $product_terms as $key => $term ) {
			if ( $term->slug == $referer ) {
				$range_parent = $term->term_id;
				break;
			}
		}

	} else {

		foreach ( $product_terms as $key => $term ) {
			if ( $term->parent != 0 ) {
				$range_parent = $term->term_id;
				break;
			}
		}

	}

	$multiple_in_range = false;

	if ( is_array( $atts ) && array_key_exists( 'multiple', $atts ) && $atts['multiple'] == '1' ) {
		$multiple_in_range = true;
	}

	$html = '';
	
	$post_title = get_the_title();

	$required_info = array( 'pa_width', 'pa_backing', 'pa_fibre', 'pa_suitability-1', 'pa_suitability-2', 'pa_suitability-3', 'pa_underlay-1', 'pa_underlay-2', 'pa_underlay-3', 'pa_design-1', 'pa_design-2', 'pa_design-3', 'pa_code' );

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
	$sku_arr      = wc_get_product_terms( $post_id, 'pa_code', array( 'fields' => 'names' ) );

	$width    = is_array( $width_arr ) && array_key_exists( 0, $width_arr ) ? $width_arr[0] : false;
	$backing  = is_array( $backing_arr ) && array_key_exists( 0, $backing_arr ) ? $backing_arr[0] : false;
	$fibre    = is_array( $fibre_arr ) && array_key_exists( 0, $fibre_arr ) ? $fibre_arr[0] : false;
	$suit_1   = is_array( $suit_1_arr ) && array_key_exists( 0, $suit_1_arr ) ? $suit_1_arr[0] : false;
	$suit_2   = is_array( $suit_2_arr ) && array_key_exists( 0, $suit_2_arr ) ? $suit_2_arr[0] : false;
	$suit_3   = is_array( $suit_3_arr ) && array_key_exists( 0, $suit_3_arr ) ? $suit_3_arr[0] : false;
	$under_1  = is_array( $under_1_arr ) && array_key_exists( 0, $under_1_arr ) ? $under_1_arr[0] : false;
	$under_2  = is_array( $under_2_arr ) && array_key_exists( 0, $under_2_arr ) ? $under_2_arr[0] : false;
	$under_3  = is_array( $under_3_arr ) && array_key_exists( 0, $under_3_arr ) ? $under_3_arr[0] : false;
	$sku      = is_array( $sku_arr ) && array_key_exists( 0, $sku_arr ) ? $sku_arr[0] : false;

	$_product = wc_get_product( $post_id );
	$price    = $_product->get_price();

	$_src      = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'single-post-thumbnail' );
	$src       = is_array( $_src ) && array_key_exists( 0, $_src ) ? $_src[0] : '';
	$src_arr   = is_object( $product ) ? array_values( $product->get_gallery_attachment_ids() ) : array();
	$src_angle = count( $src_arr ) > 0 ? wp_get_attachment_url( $src_arr[0] ) : '';

	$range_link = get_category_link( $range_parent );
	$range_name = get_cat_name( $range_parent );

	$html .= '<div class="material-view ' . $material . ' box-shadow">';
	$html .= '<div class="material__header">';

		$html .= '<div class="header__back">';
		$html .= '<a href="' . $range_link . '"><i class="icon-crucial-left-arrow"></i>&nbsp;&nbsp;Back to ' . $range_name . '</a>';
		$html .= '</div>';

		$html .= '<div class="header__titles">';
		$html .= '<h1>' . $post_title . '</h1>';
		$html .= '<h3>Code: ' . $sku . '</h3>';
		$html .= '</div>';

		$html .= '<div class="header__links">';
		$html .= '<ul>';
		$html .= '<li><a href="#" onclick="window.print()">Print Factsheet</h3></a></li>';
//		$html .= '<li><a href="#">Get a Quote</a></li>';
		$html .= '<li><a href="' . site_url() . '/start-rugbuilder">Rug Builder</a></li>';
		$html .= '<li><a href="#" data-product-id="' . $post_id . '" data-product-name="' . $post_title . '" id="add-swatch-to-basket">Order Swatch</a></li>';
		$html .= '</ul>';
		$html .= '</div>';

	$html .= '</div>';
	$html .= '<div class="material__body clearfix">';

		$multiple_class = '';

		if ( !$multiple_in_range ) {
			$multiple_class = 'full';
		}

		$html .= '<div class="image-container object-fit-container clearfix ' . $multiple_class . '">';

		$html .= '<img src="' . $src . '" alt="' . $post_title . '" class="material-img">';

//		if ( $src_angle != '' ) {
//			$html .= '<a href="#" class="change-image-view" data-view="top" data-top="' . $src . '" data-angle="' . $src_angle . '">Change View</a>';
//		}

		$html .= '</div>';

		if ( $multiple_in_range ) {
			include get_template_directory() . '/patterns/material-view/material-view-others-in-range.php';
		}

		if ( $width || $backing || $fibre || $suit_1 || $suit_2 || $suit_3 || $under_1 || $under_2 || $under_3 || $design_1 || $design_2 || $design_3 ) {
			include get_template_directory() . '/patterns/material-view/material-view-info-section.php';
		}

	$html .= '</div>';
	$html .= '</div>';

	if ( $atts != '' && array_key_exists( 'post_id', $atts ) ) {
		wp_reset_postdata();
	}

	return $html;
}

add_shortcode( 'material-view', 'material_view' );