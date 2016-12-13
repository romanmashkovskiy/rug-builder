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
	
	$title    = get_the_title();
	$subtitle = get_post_meta( get_the_ID(), 'subtitle', true );
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
	
	$html .= '<h1>' . $title . '</h1>';
	
	// Show archive title if is set to archive in $atts
	if (!empty($header_archive_title)) : 
		$html .= '<h1>'.$archive_title.'</h1>';
	endif;
	
	$html .= '</div>';
	
	// Add dark image overlay if $atts set to true 
	if (!empty($header_overlay)) : 
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
			'include' => array(7, 6, 8, 9, 10, 11),
		);

		$categories = get_terms( 'product_cat', $args );

		$this_cat          = get_term_by( 'slug', $material, 'product_cat' );
		$this_cat_post_id  = get_term_meta( $this_cat->term_id, 'thumbnail_id', true );

		$this_thumb_id  = get_woocommerce_term_meta( $this_cat->term_id, 'thumbnail_id', true );
		$this_cat_thumb = wp_get_attachment_url( $this_thumb_id );

		$html .= '<header class="material ' . $header_size . ' clearfix">';

		$html .= '<div class="material__name ' . $material . '">';
		$html .= '<h3 class="rotate">' . $umaterial . '</h3>';
		$html .= '</div>';

		$html .= '<div class="material__icon vertical-align">';
		if ( $this_cat_thumb ) {
			$html .= '<img src="' . $this_cat_thumb . '" alt="' . $material . '">';
		}
		$html .= '</div>';

		$html .= '<div class="material__info ' . $material . ' vertical-align">';
		$html .= '<h3 class="subtitle">True Survivor</h3>';
		$html .= '<h1>' . $umaterial . '</h1>';
		if ( $header_size == 'large' ) {
			$html .= '<p>' . $this_cat->description . '</p>';
		}
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



/************** Collection Header **************/ 

function header_collection_shortcode($atts = '') {

	$html = '';

	if ( $atts != '' && array_key_exists('collection', $atts) ) {

		$collection = $atts['collection'];
		$name       = strtoupper( $collection );

		$html .= '<header class="material large clearfix">';

		$html .= '<div class="material__name ' . $collection . '">';
		$html .= '<h3 class="rotate">' . $name . '</h3>';
		$html .= '</div>';

		$html .= '</header>';
	}

	return $html;
}

add_shortcode( 'header-collection', 'header_collection_shortcode' );





