<?php

/**
 * Template Name: Material Slider
 * The materials slider used on the homepage 
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

			$active_class = $i == 0 ? 'active' : '';

			$all_materials .= '<li data-slide="' . $i . '"><img src="' . $mat_src . '" alt="' . $mat_alt . '" class="' . $active_class . '"></li>';
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

			$arrow_left = '
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="59px" viewBox="0 0 31 59" version="1.1" class="prev-slide">
				<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
					<g id="vivid" transform="translate(-45.000000, -553.000000)" stroke="#FFFFFF">
						<g id="slider-arrow" transform="translate(60.500000, 582.000000) rotate(-180.000000) translate(-60.500000, -582.000000) translate(46.000000, 553.000000)">
							<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>
							<path d="M0,57.6057312 L28.6057312,29" id="Line"/>
						</g>
					</g>
				</g>
			</svg>
			';

			$arrow_right = '
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="58px" viewBox="0 0 31 58" version="1.1" class="next-slide">
				<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
					<g id="vivid" transform="translate(-1556.000000, -553.000000)" stroke="#FFFFFF">
						<g id="slider-arrow" transform="translate(1557.000000, 553.000000)">
							<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>
							<path d="M0,57.6057312 L28.6057312,29" id="Line"/>
						</g>
					</g>
				</g>
			</svg>
			';

			$html .= '<li class="material-slide">';

			$html .= '<h3 class="slide__title rotate ' . $alt . '">Our Materials</h3>';

			$html .= '<ul class="slide__list">';
			$html .= $all_materials;
			$html .= '</ul>';

			$html .= '<div class="slide__content">';
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

			$html .= '<div class="slide__nav">';
			$html .= $arrow_left;
			$html .= $arrow_right;
			$html .= '</div>';

			$html .= '</li>';
		}

		$html .= '</ul>';
	}

	return $html;
}

add_shortcode( 'materials-slider', 'materials_slider' );