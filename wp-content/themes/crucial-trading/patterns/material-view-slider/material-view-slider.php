<?php

/**
 * Template Name: Material View Slider
 * The slider for the single material page that gets the materials
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function material_view_slider( $atts = '' ) {

	global $post;

	// If being shown in pattern library set default post to 102
	if ( $atts != '' && array_key_exists( 'pattern', $atts ) ) {
		$post = get_post( 102 );
	}

	$html = '';

	// Array of all products to be shown
	$posts = array();

	// Current product ID
	$current_product_id = get_the_ID();

	// Current product range and material
	$current_product_material = 'wool';
	$current_product_range    = 'affluence';

	if ( is_array( $atts ) && array_key_exists( 'range', $atts ) ) {
		$current_product_range = $atts['range'];
	}
	
	if ( is_array( $atts ) && array_key_exists( 'material', $atts ) ) {
		$current_product_material = $atts['material'];
	}

	// Get all WooCommerce products
	$woocommerce_products          = new WP_Query( array( 'post_type' => 'product', 'order' => 'ASC' ) );
	$woocommerce_products_in_range = array();

	for ( $r = 0; $r < count( $woocommerce_products->posts ); $r++ ) {

		$product    = $woocommerce_products->posts[$r];
		$categories = get_the_terms( $product->ID, 'product_cat' );

		for ( $i2 = 0; $i2 < count( $categories ); $i2++ ) {

			if ( $categories[$i2]->parent != 0 ) {
				if ( $categories[$i2]->slug == $current_product_range ) {
					array_push( $woocommerce_products_in_range, $product );
				}
			}
		}
	}

	// Get all WooCommerce product IDs
	$woocommerce_products_ids = array();
	for ( $w = 0; $w < count( $woocommerce_products_in_range ); $w++ ) {
		array_push( $woocommerce_products_ids, $woocommerce_products_in_range[$w]->ID );
	}

	// Find index of current product ID in $woocommerce_products_ids
	$current_index = array_search( $current_product_id, $woocommerce_products_ids );

	// Add previous and next two product IDs to $posts
	if ( $current_index > 1 ) {
		$posts[0] = isset( $woocommerce_products_ids[$current_index - 2] ) ? $woocommerce_products_ids[$current_index - 2] : false;
		$posts[1] = isset( $woocommerce_products_ids[$current_index - 1] ) ? $woocommerce_products_ids[$current_index - 1] : false;
		$posts[2] = $woocommerce_products_ids[$current_index];
		$posts[3] = isset( $woocommerce_products_ids[$current_index + 1] ) ? $woocommerce_products_ids[$current_index + 1] : false;
		$posts[4] = isset( $woocommerce_products_ids[$current_index + 2] ) ? $woocommerce_products_ids[$current_index + 2] : false;
	}
	else if ( $current_index == 1 ) {
		$posts[0] = isset( $woocommerce_products_ids[$current_index - 1] ) ? $woocommerce_products_ids[$current_index - 1] : false;
		$posts[1] = $woocommerce_products_ids[$current_index];
		$posts[2] = isset( $woocommerce_products_ids[$current_index + 1] ) ? $woocommerce_products_ids[$current_index + 1] : false;
		$posts[3] = isset( $woocommerce_products_ids[$current_index + 2] ) ? $woocommerce_products_ids[$current_index + 2] : false;
		$posts[4] = isset( $woocommerce_products_ids[$current_index + 3] ) ? $woocommerce_products_ids[$current_index + 3] : false;
	} else if ( $current_index == 0 ) {
		$posts[0] = $woocommerce_products_ids[$current_index];
		$posts[1] = isset( $woocommerce_products_ids[$current_index + 1] ) ? $woocommerce_products_ids[$current_index + 1] : false;
		$posts[2] = isset( $woocommerce_products_ids[$current_index + 2] ) ? $woocommerce_products_ids[$current_index + 2] : false;
		$posts[3] = isset( $woocommerce_products_ids[$current_index + 3] ) ? $woocommerce_products_ids[$current_index + 3] : false;
		$posts[4] = isset( $woocommerce_products_ids[$current_index + 4] ) ? $woocommerce_products_ids[$current_index + 4] : false;
	}

	// Remove any empty entries from $posts
	$posts = array_values( array_filter( $posts ) );

	$html .= '<div class="material-view-slider">';
	$html .= '<ul id="material-view-slider-list">';

	$current = 0;

	for ( $i = 0; $i < count( $posts ); $i++ ) {

		$show_this = '';

		if ( $posts[$i] == $current_product_id ) {
			$show_this = ' data-show="' . $i . '" ';
			$current = $i + 1;
		}

		$html .= '<li><span' . $show_this . '></span>' . do_shortcode( '[material-view post_id="' . $posts[$i] . '" material="' . $current_product_material . '"]' ) . '</li>';
	}

	$prev  = $current - 1;
	$next  = $current + 1;
	$total = count( $posts );

	if ( $prev == 0 ) {
		$prev = $total;
	}

	if ( $next == $total + 1 ) {
		$next = 1;
	}

	$html .= '</ul>';
	$html .= '<span id="material-view-slider-prev" class="vertical-align"></span>';
	$html .= '<span id="material-view-slider-prev-text"><h3 data-current="' . $current . '" data-total="' . $total . '">' . $prev . '/' . $total . '</h3></span>';
	$html .= '<span id="material-view-slider-next" class="vertical-align"></span>';
	$html .= '<span id="material-view-slider-next-text"><h3>' . $next . '/' . $total . '</h3></span>';
	$html .= '</div>';

	// If being shown in pattern library reset post data
	if ( $atts != '' && array_key_exists( 'pattern', $atts ) ) {
		wp_reset_postdata();
	}

	return $html;
}

add_shortcode( 'material-view-slider', 'material_view_slider' );