<?php

/**
 * Template Name: Collection Swatches
 * The swatches on the collections pages
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function collection_swatches( $atts = '' ) {

	$html = '';

	if ( is_array( $atts ) && array_key_exists( 'collection', $atts ) ) {

		$collection = $atts['collection'];
		$title      = strtoupper( $collection );

		$tag_id   = get_term_by( 'slug', $collection, 'product_tag' )->term_id;
		$tag_desc = tag_description( $tag_id );

		$args = array(
			'post_type'   => 'product',
			'tax_query'   => array(
				array(
					'taxonomy' => 'product_tag',
					'field'    => 'slug',
					'terms'    => $collection,
				)
			),
			'ignore_sticky_posts'    => true,
		'no_found_rows'        => true
		);

		$query = new WP_Query( $args );

		$html .= '<div class="collection-swatches box-shadow clearfix">';
		$html .= '<h3 class="collection__title">' . $title . '</h3>';
		$html .= '<div class="swatch-container">';

		if ( $query->post_count > 0 ) {

			for ( $i = 0; $i < $query->post_count; $i++ ) {

				$product      = $query->posts[$i];
				$product_id   = $product->ID;
				$product_meta = get_post_meta( $product_id, '_product_attributes', true );

				$src  = wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'medium' )[0];
				$name = $product->post_title;
				$code = is_array( $product_meta ) && array_key_exists( 'code', $product_meta ) ? $product_meta['code']['value'] : false;
				$href = get_the_permalink( $product_id );

				$html .= '<div class="swatch">';
				$html .= '<a href="' . $href . '">';

				if ( $src != '' ) {
					$html .= '<img src="' . $src . '" alt="' . $name . '">';
				}
				
				$html .= '<h3 class="swatch__title">' . $name . '</h3>';
				$html .= '<h3 class="swatch__code">- ' . $code . '</h3>';
				$html .= '</a>';
				$html .= '</div>';
			}
		}

		$html .= '</div>';
		$html .= $tag_desc;
		$html .= '</div>';

		wp_reset_postdata();
	}

	return $html;
}

add_shortcode( 'collection-swatches', 'collection_swatches' );