<?php

/**
 * Template Name: Super Slider
 * The large full size slider used on the homepage 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

/************** Normal Header **************/ 

function header_shortcode($atts = '') {

	wp_reset_postdata();

	$header_size = 'small';

	if ( $atts != '' && array_key_exists('size', $atts) && $atts['size'] == 'large' ) {
		$header_size = 'large';
	}
	
	// Check if image overlay set or not  
	if ( !empty($atts['overlay']) ) :
		$header_overlay = $atts['overlay'];
	else : 
		$header_overlay = '';
	endif;
	
	// Check if archive, cat or tag page set to true 
	if ( !empty($atts['archive']) ) :
		$header_archive_title = $atts['archive'];
	else : 
		$header_archive_title = '';
	endif;
	
	$title         = get_the_title();
	$subtitle      = get_post_meta( get_the_ID(), 'subtitle', true );
	$archive_title = get_the_archive_title();

	$attachment_id = has_post_thumbnail() ? get_post_thumbnail_id() : false;
	$background    = $attachment_id ? wp_get_attachment_image_url( $attachment_id, 'full' ) : '';

	$html = '';

	if (!empty($background)) :
		$html .= '<header class="' . $header_size . '" style="background-image: url(' . $background . ')">';
	else : 
		$html .= '<header class="' . $header_size . '">';
	endif;
	
	$html .= '<div class="header__text vertical-align">';
	$html .= '<h3 class="side-title">' . $title . '</h3>';
	
	if (!empty($subtitle)) : 
		$html .= '<h3 class="subtitle">' . $subtitle . '</h3>';
	endif;

	if ( is_array( $atts ) && array_key_exists( 'search', $atts ) ) {
		$title = $atts['search'];
	}
		
	// Show archive title if is set to archive in $atts
	if (!empty($header_archive_title)) : 
		$html .= '<h1>'.$archive_title.'</h1>';
	else : 
		$html .= '<h1>' . $title . '</h1>';
	endif;
	
	$html .= '</div>';
	
	// Add dark image overlay if $atts set to true 
	if (!empty($header_overlay) && (!empty($background)) ) : 
		$html .= '<div class="header__overlay"></div>';
	endif;
	
	$html .= '</header>';

	return $html;
}

add_shortcode( 'header', 'header_shortcode' );



/************** Materials Header **************/ 

function header_material_shortcode($atts = '') {

	$header_size = 'large';

	if ( $atts != '' && array_key_exists('size', $atts) && $atts['size'] == 'small' ) {
		$header_size = 'small';
	}

	$html = '';

	if ( $atts != '' && array_key_exists('material', $atts) ) {

		$material  = $atts['material'];
		$umaterial = ucwords( str_replace( '-', ' ', $atts['material'] ) );
		
		// Get Categories for Side menu 
		$args = array(
			'hide_empty' => false, 
			'orderby'    => 'name',
			'parent'     => 0,
		);

		$categories = get_terms( 'product_cat', $args );
		$categories = exclude_rug_borders( $categories );
		$categories = sort_materials_menu_order( $categories );

		$this_cat          = get_term_by( 'slug', $material, 'product_cat' );
		$term_id           = $this_cat->term_id;
		$this_cat_post_id  = get_term_meta( $term_id, 'thumbnail_id', true );

		$this_thumb_id  = get_woocommerce_term_meta( $term_id, 'thumbnail_id', true );
		$this_cat_thumb = wp_get_attachment_url( $this_thumb_id );

		$data = get_option("category_$term_id");

		$subtitle    = is_array( $data ) && array_key_exists( 'subtitle', $data ) ? $data['subtitle'] : '';
		$bg_image_id = is_array( $data ) && array_key_exists( 'bg_image', $data ) ? $data['bg_image'] : false;
		$bg_image    = $bg_image_id ? wp_get_attachment_image_src( $bg_image_id, 'full' )[0] : '';

		// Construct HTML

		$html .= '<header class="material ' . $header_size . ' clearfix" style="background-image:url(';
		$html .= "'" . $bg_image . "'";
		$html .= ');">';

		$html .= '<div class="material__name ' . $material . '">';
		$html .= '<h3 class="rotate">' . $umaterial . '</h3>';
		$html .= '</div>';

//		$html .= '<div class="material__icon vertical-align">';
//		if ( $this_cat_thumb ) {
//			$html .= '<img src="' . $this_cat_thumb . '" alt="' . $material . '">';
//		}
//		$html .= '</div>';

		$html .= '<div class="material__info ' . $material . '">';
		$html .= '<h3 class="subtitle">' . $subtitle . '</h3>';
		$html .= '<h1>' . $umaterial . '</h1>';
//		if ( $header_size == 'large' ) {
//			$html .= '<p>' . $this_cat->description . '</p>';
//		}
		$html .= '</div>';

		if ( $header_size == 'large' ) {

			$html .= '<div class="material__sidememu">';
			$html .= '<ul>';

			for ( $i=0; $i<count( $categories ); $i++ ) {

				$cat  = $categories[$i];

				if ( $cat->parent == 0 ) {

					$post = get_term_meta( $cat->term_id, 'thumbnail_id', true );

					$thumb_id = get_woocommerce_term_meta( $cat->term_id, 'thumbnail_id', true );
					$src      = wp_get_attachment_url( $thumb_id );
					$alt      = $cat->slug; 

					$active_class = $material == $alt ? 'class="active"' : '';

					$html .= '<li>';
					$html .= '<a href="' . get_site_url() . '/material/' . $alt . '" class="no-effect">';
					$html .= '<img src="' . $src . '" alt="' . $alt . '" ' . $active_class . '>';
					$html .= '</a>';
					$html .= '<li>';
				}
			}

			$html .= '</ul>';
			$html .= '</div>';
		}

		$html .= '</header>';
	}

	return $html;
}

add_shortcode( 'header-material', 'header_material_shortcode' );

/************** Range Header **************/


function header_range_shortcode($atts = '') {
	
	$html = '';
	
	if ( $atts != '' && array_key_exists('range', $atts) ) {

		// Get Categories for Side menu 
		$args = array(
			'hide_empty' => false, 
			'orderby'    => 'name',
			'parent'     => 0,
		);

		$categories = get_terms( 'product_cat', $args );
		$categories = exclude_rug_borders( $categories );
		$categories = sort_materials_menu_order( $categories );

		$range = $atts['range'];
		
		$range_cat = get_term_by( 'slug', $range, 'product_cat' );
		$range_id  = $range_cat->term_id;
		$range_parent = $range_cat->parent;
		
		
		$request_uri  = $_SERVER['REQUEST_URI'];
		$swatches_pos = strpos( $request_uri, 'material/' );
		$uri_substr   = substr( $request_uri, $swatches_pos + 9 );
		$material_end = strpos( $uri_substr, '/' );
		$material     = substr( $uri_substr, 0, $material_end );

		//$material_id   = get_term_by( 'slug', $material, 'product_cat' )->term_id;
		//$material_meta = get_option( "category_$material_id" );
		//$material_desc = is_array( $material_meta ) && array_key_exists( 'subtitle', $material_meta ) ? $material_meta['subtitle'] : '';

		$html .= '<header class="material small -range clearfix">';

		$html .= '<div class="material__name">';
		$html .= '<h3 class="rotate">' . $range . '</h3>';
		//$html .= '<h3 class="subtitle">' . $material_desc . '</h3>';
		$html .= '<h3 class="subtitle">' . get_cat_name($range_parent) . '</h3>';
		$html .= '<h1>' . $range . '</h1>';
		$html .= '</div>';

		/*$html .= '<div class="material__sidememu">';
		$html .= '<ul>';

		for ( $i=0; $i<count( $categories ); $i++ ) {

			$cat  = $categories[$i];

			if ( $cat->parent == 0 ) {

				$post = get_term_meta( $cat->term_id, 'thumbnail_id', true );

				$thumb_id = get_woocommerce_term_meta( $cat->term_id, 'thumbnail_id', true );
				$src      = wp_get_attachment_url( $thumb_id );
				$alt      = $cat->slug; 

				$active_class = $material == $alt ? 'class="active"' : '';

				$html .= '<li>';
				$html .= '<a href="' . get_site_url() . '/material/' . $alt . '" class="no-effect">';
				$html .= '<img src="' . $src . '" alt="' . $alt . '" ' . $active_class . '>';
				$html .= '</a>';
				$html .= '<li>';
			}
		}

		$html .= '</ul>';
		$html .= '</div>';*/

		$html .= '</header>';
	}

	return $html;
}

add_shortcode( 'header-range', 'header_range_shortcode' ); 

/************** Collection Header **************/ 

function header_collection_shortcode($atts = '') {

	$html = '';

	if ( $atts != '' && array_key_exists('collection', $atts) ) {

		$collection  = $atts['collection'];
		$ucollection = ucwords( $collection );
		$name        = strtoupper( $collection );

		$args = array(
			'post_type' => 'super-slider',
			'name'      => $collection,
		);

		$query = new WP_Query( $args );

		$bg_image = '';

		if ( $query->have_posts() ) {
			$post_id       = $query->posts[0]->ID;
			$attachment_id = get_post_thumbnail_id( $post_id );
			$bg_image      = wp_get_attachment_image_url( $attachment_id, 'full' );
		}

		$html .= '<header class="material small collection clearfix" style="background-image:url(';
		$html .= "'" . $bg_image ."'";
		$html .= ')">';

		$html .= '<div class="material__name ' . $collection . '">';
//		$html .= '<h3 class="rotate">' . $name . '</h3>';
		$html .= '</div>';

		$html .= '</header>';
	}

	return $html;
}

add_shortcode( 'header-collection', 'header_collection_shortcode' );





