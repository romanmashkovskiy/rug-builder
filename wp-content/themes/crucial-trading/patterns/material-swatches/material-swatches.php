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

		$material = '';

		if ( count( $_GET ) > 0 && array_key_exists( 'ref', $_GET ) ) {
			$material = filter_var( $_GET['ref'], FILTER_SANITIZE_STRING );
		} else {
			$range_parent = $range_cat->parent;
			$parent       = get_term_by( 'id', $range_parent, 'product_cat' );
			$material     = $parent->slug;
		}			

		$args = array(
			'post_type'   => 'product',
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
			
			// Back to material link 
				//firstly, load data for your child category
				$child = get_category($range_id);
				
				//from your child category, grab parent ID
				$parent = $child->parent;
				
				//load object for parent category
				$parent_name = get_category($parent);
				
				// Create Link 
				echo '<div class="swatches__back"><a href="'.get_category_link($parent_name->term_id).'"><i class="icon-crucial-left-arrow"></i>&nbsp;&nbsp;Back to '.$parent_name->name.'</a></div>';
			
			foreach ( $products->posts as $key => $value ) {

				$product_id = $value->ID;

				$title = get_the_title( $product_id );
				$link  = get_the_permalink( $product_id ) . '?ref=' . $material;
				$src   = wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'single-post-thumbnail' )[0];

				echo '<div class="swatch">';
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

			echo '</div>';

		endif;

		wp_reset_postdata();

	}

	return $html;
}

add_shortcode( 'material-swatches', 'material_swatches' );