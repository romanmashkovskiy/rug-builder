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

	// Array of all products to be shown, will be 5 length
	$posts = array();
	
	// Current product, to be shown, put in middle of 5 length array
	$posts[2] = array(
		'id'    => get_the_ID(),
		'title' => get_the_title(),
	);

	// Get all WooCommerce products
	$woocommerce_products = new WP_Query( array( 'post_type' => 'product', 'order' => 'ASC' ) );

	// Get all WooCommerce product IDs
	$woocommerce_products_ids = array();
	for ( $w = 0; $w < $woocommerce_products->post_count; $w++ ) {
		array_push( $woocommerce_products_ids, $woocommerce_products->posts[$w]->ID );
	}

	// Find index of current product ID in $woocommerce_products_ids
	$current_index = array_search( $posts[2]['id'], $woocommerce_products_ids );

	echo '<pre>';
	print_r($woocommerce_products_ids);
	print_r( $current_index);
	echo '</pre>';

	// If being shown in pattern library reset post data
	if ( $atts != '' && array_key_exists( 'pattern', $atts ) ) {
		wp_reset_postdata();
	}

	return $html;
}

add_shortcode( 'material-view-slider', 'material_view_slider' );