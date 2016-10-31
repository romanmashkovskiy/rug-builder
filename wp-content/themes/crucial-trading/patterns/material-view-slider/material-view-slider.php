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
	$current_product_id    = get_the_ID();
	$current_product_terms = get_the_terms( $current_product_id, 'product_cat' );
	$current_product_range = '';

	for ( $c = 0; $c < count( $current_product_terms ); $c++ ) {

		$parent_id = $current_product_terms[$c]->parent;
		$parent    = get_term( $parent_id, 'product_cat' );

		if ( $parent->slug == 'range-parent' ) {
			$current_product_range = $current_product_terms[$c]->slug;
			break;
		}
	}

	// Get all WooCommerce products
	$woocommerce_products          = new WP_Query( array( 'post_type' => 'product', 'order' => 'ASC' ) );
	$woocommerce_products_in_range = array();

	for ( $r = 0; $r < count( $woocommerce_products->posts ); $r++ ) {

		$product = $woocommerce_products->posts[$r];

		$categories = get_the_terms( $product->ID, 'product_cat' );

		for ( $r2 = 0; $r2 < count( $categories ); $r2++ ) {

			$cat_parent_id = $categories[$r2]->parent;
			$cat_parent    = get_term( $cat_parent_id, 'product_cat' );

			if ( $cat_parent->slug == 'range-parent' ) {

				$range = $categories[$r2]->slug;

				if ( $range == $current_product_range ) {
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

	for ( $i = 0; $i < count( $posts ); $i++ ) {

		$show_this = '';

		if ( $posts[$i] == $current_product_id ) {
			$show_this = ' data-show="' . $i . '" ';
		}
		$html .= '<li><span' . $show_this . '></span>' . do_shortcode( '[material-view post_id="' . $posts[$i] . '"]' ) . '</li>';
	}

	$html .= '</ul>';
	$html .= '<span id="material-view-slider-prev" class="vertical-align"></span>';
	$html .= '<span id="material-view-slider-next" class="vertical-align"></span>';
	$html .= '</div>';

	// If being shown in pattern library reset post data
	if ( $atts != '' && array_key_exists( 'pattern', $atts ) ) {
		wp_reset_postdata();
	}

	return $html;
}

add_shortcode( 'material-view-slider', 'material_view_slider' );