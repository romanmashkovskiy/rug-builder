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

function crucial_slider_slides() {

	global $wp_query;

	$args = array(
		'post_type'   => 'super-slider',
		'post_status' => 'publish',
		'orderby'     => 'menu_order',
		'ignore_sticky_posts'    => true,
		'no_found_rows'        => true
	);

	$html = '';

	$query = new WP_Query( $args );

	$post_count = $query->post_count;

	$i = 0;

	if ( $query->have_posts() ) :

		$html .= '<div id="super-slider">';
		$html .= '<ul class="slides-container">';

		while ( $query->have_posts() ) : $query->the_post();

			$current_post = $query->current_post;

			$post_id       = get_the_ID();
			$attachment_id = get_post_thumbnail_id( $post_id );

			$post_title = get_the_title();
			$rotate     = $post_title == 'Opening' ? 'Your Journey' : $post_title;
			$title      = $post_title == 'Opening' ? 'Crucial Trading' : $post_title;
			$link_text  = rwmb_meta( 'link-text' );

			$has_background_image = false;

			$src       = wp_get_attachment_image_url( $attachment_id, 'full' );
			$srcset    = wp_get_attachment_image_srcset( $attachment_id );
			$alt       = 'Crucial Trading - ' . $link_text;

			$link_url  = '#';
			$link_meta = rwmb_meta( 'link' );

			if ( $link_meta ) {
				$link_url = site_url() . '/collection/' . rwmb_meta( 'link' )->slug;
			}

			$arrow_left = '
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="59px" viewBox="0 0 31 59" version="1.1" class="slide__arrow--left">
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
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="58px" viewBox="0 0 31 58" version="1.1" class="slide__arrow--right">
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

			$arrow_down = '
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="57.404px" height="28.605px" viewBox="-13.299 14.5 57.404 28.605" enable-background="new -13.299 14.5 57.404 28.605" xml:space="preserve" class="slide__arrow--down">
				<g id="Home">
					<g id="vivid" transform="translate(-1556.000000, -553.000000)">
						<g id="slider-arrow" transform="translate(1557.000000, 553.000000)">
							<path id="Line" fill="none" stroke="#FFFFFF" stroke-linecap="square" d="M43.105,14.701L14.5,43.307"/>
							<path id="Line_1_" fill="none" stroke="#FFFFFF" stroke-linecap="square" d="M-14.299,14.5l28.605,28.605"/>
						</g>
					</g>
				</g>
			</svg>
			';

			$slide_numbers = '<ul class="slide__numbers">';

			for ( $i=0; $i<$post_count; $i++ ) {

				$num    = $i+1;
				$active = $i == $current_post ? 'active' : '';

				$slide_numbers .= '<li class="' . $active . '"><h3>0' . $num . '.</h3><span></span></li>';
			}

			$slide_numbers .= '</ul>';

			$opening_class = '';

			if ( $post_title == 'Opening' ) {
				$opening_class = 'opening';
			}

			$image_side_class = '';

			if ( $current_post % 2 == 0 ) {
				$image_side_class = 'image-right';
			} else {
				$image_side_class = 'image-left';
			}

			$html .= "<li class='slide object-fit-container $opening_class $image_side_class'>";

			$html .= '<nav class="slides-navigation vertical-align">';

			$html .= '<div class="nav_prev">';
			$html .= '<a href="#" class="prev no-effect">';
			$html .= $arrow_left;
			$html .= '</a>';
			$html .= '<h3 class="rotate">' . $rotate . '</h3>';
			$html .= '</div>';

			$html .= '<div class="nav_next">';
			$html .= '<a href="#" class="next no-effect">';
			$html .= $arrow_right;
			$html .= '</a>';
			$html .= $slide_numbers;
			$html .= '</div>';

			$html .= '</nav>';
			
			if ( $has_background_image ) {

				$html .= '<img src="' . $src . '" alt="' . $alt . '" class="background">';

				$html .= '<div class="slide__center vertical-align ' . $opening_class . '">';

				if ( $post_title != 'Opening' ) {
					$html .= '<h1 class="home-banner-header">' . $title . '</h1>';
					$html .= '<a href="' . $link_url . '">' . $link_text . '</a>';
				}
				else {
					$html .= '<img src="http://d105txpzekqrfa.cloudfront.net/uploads/20161213220240/crucial-logo-white%402x.png" alt="Crucial Trading - Where Inspiration Begins" class="opening-slide-logo">';
					$html .= '<p>Welcome to the start of your journey where imagination flourishes, ideas form and decisions are made. We aim to inspire and delight. Choose the right floorcovering and everything else falls into place.</p>';
					$html .= '<span></span>';
					$html .= '<a href="http://d105txpzekqrfa.cloudfront.net/uploads/crucial-trading-brand-film.mp4" class="html5lightbox">';
					$html .= '<div class="video-play-button"></div>';
					$html .= '</a>';
				}

				$html .= '</div>';
				
			} else {

				$html .= '<div class="slide__title">';

				if ( $post_title != 'Opening' ) {
					$html .= '<h1 class="home-banner-header">' . $title . '</h1>';
					$html .= '<a href="' . $link_url . '">' . $link_text . '</a>';
				} else {
					$html .= '<img src="http://d105txpzekqrfa.cloudfront.net/uploads/20161212170153/CT_LogoStrapline_Black1.svg" alt="Crucial Trading - Where Inspiration Begins" class="opening-slide-logo">';
					$html .= '<p>Welcome to the start of your journey where imagination flourishes, ideas form and decisions are made. We aim to inspire and delight. Choose the right floorcovering and everything else falls into place.</p>';
				}

				$html .= '</div>';

				$html .= '<div class="slide__image">';

				if ( $post_title != 'Opening' ) {
					$html .= '<img src="' . $src . '" alt="' . $alt . '">';
				}
				
				if ( $post_title == 'Opening' ) {

					$poster = 'http://d105txpzekqrfa.cloudfront.net/uploads/20161212170153/CT_LogoStrapline_Black1.svg';
					$video  = 'http://d105txpzekqrfa.cloudfront.net/uploads/crucial-trading-brand-film.mp4';

					$html .= do_shortcode( '[video src="' . $video . '" poster="' . $poster .'"]' );

//					$html .= '<video controls preload="auto" poster="' . $poster . '" >';
//					$html .= '<source src="' . $video . '" type="video/mp4">';
//					$html .= '</video>';

				}

				$html .= '</div>';

				$html .= '<div class="slide__boxes">';
				$html .= '<div class="box__one"></div>';
				$html .= '<div class="box__two"></div>';
				$html .= '</div>';

			}

			$html .= '<div class="slide__bottom ' . $opening_class . '">';
			$html .= $arrow_down;
			$html .= '<h3>Scroll Down</h3>';
			$html .= '</div>';

			$html .= '</li>';

			$i++;

		endwhile;

		$html .= '</ul>';
		$html .= '</div>';

	endif;

	return $html;
}

add_shortcode( 'super-slider', 'crucial_slider_slides' );