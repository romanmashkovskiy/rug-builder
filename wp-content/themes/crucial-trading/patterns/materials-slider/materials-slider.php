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

function materials_slider() {

	$html = '';

	$args = array(
		'hide_empty' => false,
		'orderby'    => 'name',
	);

	$categories = get_terms( 'product_cat', $args );

	if ( count( $categories ) > 0 ) {

		$all_materials = '';

		for ( $i=0; $i<count( $categories ); $i++ ) {

			$mat_post = get_post( get_term_meta( $categories[$i]->term_id, 'thumbnail_id', true ) );
			$mat_src  = $mat_post->guid;
			$mat_alt  = $mat_post->post_title;

			$all_materials .= '<li data-slide="' . $i . '"><img src="' . $mat_src . '" alt="' . $mat_alt . '"></li>';
		}

		$html .= '<ul class="materials-slider">';

		for ( $i2=0; $i2<count( $categories ); $i2++ ) {

			$cat = $categories[$i2];

			$post = get_post( get_term_meta( $cat->term_id, 'thumbnail_id', true ) );
			$icon = $post->guid;
			$alt  = $post->post_title;

			$post_id = $post->ID;

			$title    = ucwords( $alt );
			$subtitle = $cat->description;

			$html .= '<li class="material-slide">';

			$html .= '<h3 class="slide__title ' . $alt . '">Our Materials</h3>';

			$html .= '<ul class="slide__list">';
			$html .= $all_materials;
			$html .= '</ul>';

			$html .= '<div class="abc">';

			$html .= '<div class="content__left vertical-align">';
			$html .= '<img src="' . $icon . '" alt="' . $alt . '">';
			$html .= '</div>';
			$html .= '<div class="content__right vertical-align ' . $alt . '">';
			$html .= '<h3>True Survivor</h3>';
			$html .= '<h1>' . $title . '</h1>';
			$html .= '<p>' . $subtitle . '</p>';
			$html .= '<a href="#">Read More</a>';
			$html .= '</div>';

			$html .= '</div>';

			$html .= '</li>';
		}

		$html .= '</ul>';
	}

	return $html;
}

add_shortcode( 'materials-slider', 'materials_slider' );

echo do_shortcode( '[materials-slider]' );