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

	global $post, $wp_query;

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

		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => -1,
			'tax_query'      => array(
				array (
					'taxonomy' => 'product_cat',
					'field'    => 'slug',
					'terms'    => $current_product_range,
				),
			),
		);

		$woocommerce_products = new WP_Query( $args );

		$html .= '<div class="material-view-slider">';
		$html .= '<ul id="material-view-slider-list">';

		$current = 1;
		
		$total = count( $woocommerce_products->posts );

		$multiple_in_range = false;

		if ( $total > 1 ) {
			$multiple_in_range = true;
		}

		$this_product = '';

		if ( is_array( $atts ) && array_key_exists( 'uri', $atts ) ) {

			$uri = $atts['uri'];

			$material_end = strpos( $uri, '/' );
			$this_product = substr( $uri, $material_end + 1, -1 );
		}

		$i = 0;
		
		while ( $woocommerce_products->have_posts() ) : $woocommerce_products->the_post();

			$product_id   = get_the_ID();
			$product_name = get_the_title();
			$product_slug = get_post( $product_id )->post_name;

			$data_show = '';

			if ( $this_product == $product_slug ) {
				$data_show = 'data-show="' . $i . '"';
				$current = $i;
			}

			$html .= '<li data-name="' . $product_name . '" data-slug="' . $product_slug . '" data-total="' . $total . '" data-index="' . $i . '" class="slidee" ' . $data_show . '>';
			$html .= do_shortcode( '[material-view post_id="' . $post->ID . '" material="' . $current_product_material . '" multiple="' . $multiple_in_range . '"]' );
			$html .= '</li>';

			$i++;

		endwhile;

		$current = $current + 1;

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
			$html .= '<span id="material-view-slider-prev-text"><h3 data-current="' . $current . '" data-total="' . $total . '">';
			$html .= '<span id="material-prev-index">' . $prev . '</span>/' . $total;
			$html .= '</h3></span>';
			$html .= '<span id="material-view-slider-next" class="vertical-align"></span>';
			$html .= '<span id="material-view-slider-next-text"><h3>';
			$html .= '<span id="material-next-index">' . $next . '</span>/' . $total;
			$html .= '</h3></span>';
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