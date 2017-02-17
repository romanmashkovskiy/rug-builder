<?php

/**
 * Template Name: Material Swatches
 * The material swatches on the ranges page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function material_swatches( $atts = '' ) {

	$html = '';

	if ( $atts != '' && array_key_exists('range', $atts) ) {

		$range     = $atts['range'];
		$range_cat = get_term_by( 'slug', $range, 'product_cat' );
		$range_id  = $range_cat->term_id;

		echo '<pre>';
		print_r($range_cat);
		echo '</pre>';

		$range_parent = $range_cat->parent;
		$parent       = get_term_by( 'id', $range_parent, 'product_cat' );
		$material     = $parent->slug;	

		$args = array(
			'post_type'   => 'product',
			'posts_per_page' => '-1',
			'tax_query'   => array(
				array(
					'taxonomy' => 'product_cat',
					'field'    => 'term_id',
					'terms'    => $range_id,
				)
			),
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true
		);

		$products = new WP_Query( $args );
		
		if ( count( $products->post_count ) > 0 ) :

			echo '<div class="swatches box-shadow clearfix">';
			
			// Create back to parent material link 
			echo '<div class="swatches__back"><a href="'.get_category_link($range_parent).'"><i class="icon-crucial-left-arrow"></i>&nbsp;&nbsp;Back to '.get_cat_name($range_parent).'</a></div>';
			
			echo '<div class="swatch__container">';
			
			foreach ( $products->posts as $key => $value ) {

				$product_id = $value->ID;

				$title = get_the_title( $product_id );
				$link  = get_the_permalink( $product_id );
				$src   = wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'thumbnail' )[0];

				$post_date     = $value->post_date;
				$post_unix     = strtotime( $post_date ); 
				$fourteen_days = strtotime( '-14 day', time() );

				$new_circle = '';

				if ( $post_unix > $fourteen_days ) {
					$new_circle = '<div class="new-product">New</div>';
				}

				echo '<div class="swatch">';
				echo $new_circle;
				echo '<a href="' . $link  . '" class="no-effect">';
				echo '<h3 class="vertical-align">' . $title . '</h3>';

				if ( $src != '' ) {
					echo '<div class="object-fit-container vertical-align">';
					echo '<img src="' . $src . '" alt="' . $title . '">';
					echo '</div>';
				}

				echo '</a>';
				echo '</div>';
			}

			echo '</div></div>';

		endif;

		wp_reset_postdata();

	}

	return $html;
}

add_shortcode( 'material-swatches', 'material_swatches' );