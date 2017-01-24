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

	if ( $current_product_range != '' ) {

		if ( is_array( $atts ) && array_key_exists( 'material', $atts ) ) {
			$current_product_material = $atts['material'];
		}
		
		// Get all WooCommerce products
		$woocommerce_products = new WP_Query( array( 'post_type' => 'product', 'order' => 'ASC', 'tax_query' => array(
			array(
				'taxonomy' => 'product_cat',
				'field'    => 'slug',
				'terms'    => $current_product_range,
			),
		), 'ignore_sticky_posts'    => true,
			'no_found_rows'        => true ) );

		$html .= '<div class="material-view-slider">';
		$html .= '<ul id="material-view-slider-list">';

		$current = 1;
		
		$total = count($woocommerce_products->posts);
		
		while ( $woocommerce_products->have_posts() ) : $woocommerce_products->the_post();

			$product_name = get_the_title();
			$html .= '<li data-name="' . $product_name . '" data-total="' . $total . '" class="slidee">' . do_shortcode( '[material-view post_id="' . $post->ID . '" material="' . $current_product_material . '"]' ) . '</li>';

		endwhile;

		$prev  = $current - 1;
		$next  = $current + 1;
		
		if ( $prev == 0 ) {
			$prev = $total;
		}

		if ( $next == $total + 1 ) {
			$next = 1;
		}

		$html .= '</ul>';

		if ( $total > 1 ) {
			$html .= '<span id="material-view-slider-prev" class="vertical-align"></span>';
			$html .= '<span id="material-view-slider-prev-text"><h3 data-current="' . $current . '" data-total="' . $total . '">' . $prev . '/' . $total . '</h3></span>';
			$html .= '<span id="material-view-slider-next" class="vertical-align"></span>';
			$html .= '<span id="material-view-slider-next-text"><h3>' . $next . '/' . $total . '</h3></span>';
		}
			
		$html .= '</div>';

	} else {

		$product_name = get_the_title();
		$total        = 1;

		$html .= '<div class="material-view-slider">';
		$html .= '<ul id="material-view-slider-list">';
		$html .= '<li data-name="' . $product_name . '" data-total="' . $total . '" class="slidee">' . do_shortcode( '[material-view post_id="' . $post->ID . '" material="' . $current_product_material . '"]' ) . '</li>';
		$html .= '</ul>';
		$html .= '</div>';

	}		

	// If being shown in pattern library reset post data
	if ( $atts != '' && array_key_exists( 'pattern', $atts ) ) {
		wp_reset_postdata();
	}

	return $html;
}

add_shortcode( 'material-view-slider', 'material_view_slider' );