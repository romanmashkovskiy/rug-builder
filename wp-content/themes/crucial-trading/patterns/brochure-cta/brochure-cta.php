<?php

/**
 * Template Name: Section Boxes
 * The section boxes 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function brochure_cta() {

	$html = '';

	$args = array(
		'post_type' => 'product',
		'title' => 'brochure',
		'ignore_sticky_posts'    => true,
		'no_found_rows'        => true
	);

	$query = new WP_Query( $args );

	if ( $query->have_posts() ) {

		$brochure = $query->posts[0];

		$brochure_id  = $brochure->ID;
		$brochure_img = wp_get_attachment_image_src( get_post_thumbnail_id( $brochure_id ), 'single-post-thumbnail' )[0];

		$html .= '<section class="section-box box-shadow clearfix">';

		$html .= '<div class="box__image left">';
		$html .= '<img src="' . $brochure_img . '" alt="Crucial Trading Brochure">';
		$html .= '</div>';

		$html .= '<div class="box__content left">';
		$html .= '<h2>Order A Brochure</h2>';
		$html .= '<span></span>';
		$html .= '<p>Order a brochure to view our entire portfolio of floorcoverings and inspirational photography.</p>';
		$html .= '<a href="#" class="order-brochure" data-product-name="Our brochure" data-product-id="' . $brochure_id . '">Order Now</a>';
		$html .= '</div>';

		$html .= '</section>';
	}

	wp_reset_postdata();

	return $html;
}

add_shortcode('brochure-cta', 'brochure_cta');