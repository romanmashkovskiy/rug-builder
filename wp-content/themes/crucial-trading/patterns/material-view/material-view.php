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
	$src_arr   = array_values( $product->get_gallery_attachment_ids() );
	$src_angle = count( $src_arr ) > 0 ? wp_get_attachment_url( $src_arr[0] ) : '';

	$html .= '<div class="material-view ' . $material . ' box-shadow">';
	$html .= '<div class="material__header">';

		$html .= '<div class="header__back">';
		$html .= '<a href="#" onclick="window.history.go(-1); return false;"><i class="icon-crucial-left-arrow"></i>&nbsp;&nbsp;Back to Materials</a>';
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
	$html .= '<div class="material__body">';

		$html .= '<div class="image-container object-fit-container">';
		$html .= '<img src="' . $src . '" alt="' . $post_title . '" class="material-img">';

		if ( $src_angle != '' ) {
			$html .= '<a href="#" id="change-image-view" data-view="top" data-top="' . $src . '" data-angle="' . $src_angle . '">Change View</a>';
		}

		if ( $width || $backing || $fibre || $suit_1 || $suit_2 || $suit_3 || $under_1 || $under_2 || $under_3 || $design_1 || $design_2 || $design_3 ) {
			$html .= '<div class="material__details clearfix">';
			$html .= '<a href="#" class="hide-material-info" data-state="open">Hide</a>';

			if ( $fibre ) {

				$icon_material = '';

				if ( stripos( $fibre, 'coir' ) !== false ) {
					$icon_material = 'coir';
				} else if ( stripos( $fibre, 'jute' ) !== false ) {
					$icon_material = 'jute';
				} else if ( stripos( $fibre, 'seagrass' ) !== false ) {
					$icon_material = 'seagrass';
				} else if ( stripos( $fibre, 'sisal' ) !== false ) {
					$icon_material = 'sisal';
				} else if ( stripos( $fibre, 'sisool' ) !== false ) {
					$icon_material = 'sisool';
				} else if ( stripos( $fibre, 'wool' ) !== false ) {
					$icon_material = 'wool';
				}

				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-' . $icon_material . '"></i>';
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
				$html .= '<i class="icon-crucial-backing"></i>';
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

				$icon_suitability = '';

				if ( stripos( $suit_1, 'stairs' ) !== false ) {
					$icon_suitability = 'stairs';
				} else if ( stripos( $suit_1, 'heavy' ) !== false ) {
					$icon_suitability = 'heavy';
				} else if ( stripos( $suit_1, 'light' ) !== false ) {
					$icon_suitability = 'light';
				} else if ( stripos( $suit_1, 'rug' ) !== false ) {
					$icon_suitability = 'changeview';
				}

				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-' . $icon_suitability . '"></i>';
				$html .= '<h3>' . $suit_1 . '</h3>';
				$html .= '</div>';
			}

			if ( $suit_2 ) {

				$icon_suitability = '';

				if ( stripos( $suit_2, 'stairs' ) !== false ) {
					$icon_suitability = 'stairs';
				} else if ( stripos( $suit_2, 'heavy' ) !== false ) {
					$icon_suitability = 'heavy';
				} else if ( stripos( $suit_2, 'light' ) !== false ) {
					$icon_suitability = 'light';
				} else if ( stripos( $suit_2, 'rug' ) !== false ) {
					$icon_suitability = 'changeview';
				}

				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-' . $icon_suitability . '"></i>';
				$html .= '<h3>' . $suit_2 . '</h3>';
				$html .= '</div>';
			}

			if ( $suit_3 ) {

				$icon_suitability = '';

				if ( stripos( $suit_3, 'stairs' ) !== false ) {
					$icon_suitability = 'stairs';
				} else if ( stripos( $suit_3, 'heavy' ) !== false ) {
					$icon_suitability = 'heavy';
				} else if ( stripos( $suit_3, 'light' ) !== false ) {
					$icon_suitability = 'light';
				} else if ( stripos( $suit_3, 'rug' ) !== false ) {
					$icon_suitability = 'changeview';
				}

				$html .= '<div class="info__section">';
				$html .= '<i class="icon-crucial-' . $icon_suitability . '"></i>';
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