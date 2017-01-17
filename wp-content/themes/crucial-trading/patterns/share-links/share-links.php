<?php

/**
 * Template Name: Material View
 * The detailed view of the material on the material page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function share_links( $atts ) {

	wp_reset_postdata();

	global $post;

	$material = '';

	if ( is_array( $atts ) && array_key_exists( 'material', $atts ) ) {
		$material = $atts['material'];
	}

	$twitter  = '';
	$facebook = '';
	$tumblr   = '';
	$subject  = '';
	$body     = '';

	if ( count( $_GET ) > 0 && array_key_exists( 'ref', $_GET ) ) {

		$ref = filter_var( urldecode( $_GET['ref'] ), FILTER_SANITIZE_STRING );

		switch ( $ref ) {

			case 'intense' :
			case 'organic' :
			case 'serenity' :
			case 'the-blend' :
			case 'vivid' :

				$title = ucwords( str_replace( '-', ' ', $ref ) );
				$link  = site_url() . '/collection/' . $ref;

				$twitter  = 'Crucial Trading: ' . $title . ' ' . $link;
				$facebook = urlencode( $link );
				$tumblr   = $link;
				$subject  = 'Crucial Trading: ' . $title;
				$body     = $title . ' ' . $link;
				break;

			case 'coir' :
			case 'jute' :
			case 'seagrass' :
			case 'sisal' :
			case 'sisool' :
			case 'wool' :

				$range = '';

				$post_id = $post->ID;
				$terms   = get_the_terms( $post_id, 'product_cat' );

				foreach ( $terms as $key => $term ) {

					if ( $term->parent != 0 ) {
						$range = $term->name;
						break;
					}

				}

				$title = ucwords( str_replace( '-', ' ', $range ) );

				$twitter  = 'Crucial Trading: ' . $title . ' ' . get_the_permalink();
				$facebook = urlencode( get_the_permalink() );
				$tumblr   = get_the_permalink();
				$subject  = 'Crucial Trading: ' . $title;
				$body     = $title . ' ' . get_the_permalink();
				break;

			default :
				$twitter  = 'Crucial Trading: ' . get_the_title() . ' ' . get_the_permalink();
				$facebook = urlencode( get_the_permalink() );
				$tumblr   = get_the_permalink();
				$subject  = 'Crucial Trading: ' . get_the_title();
				$body     = get_the_title() . ' ' . get_the_permalink();
				break;

		}

	} else {

		$twitter  = 'Crucial Trading: ' . get_the_title() . ' ' . get_the_permalink();
		$facebook = urlencode( get_the_permalink() );
		$tumblr   = get_the_permalink();
		$subject  = 'Crucial Trading: ' . get_the_title();
		$body     = get_the_title() . ' ' . get_the_permalink();
		
	}

	$html = "";

	$html .= '<div class="share-links clearfix">';

	$html .= '<div class="share-title rotated-text ' . $material . '">';
	$html .= '<span></span>';
	$html .= '<h3 class="">Share</h3>';
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-twitter link__icon transition-all"></i>';
	$html .= "<a href='https://twitter.com/intent/tweet?text=$twitter' target='_blank' class='link__text'>Twitter</a>";
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-facebook link__icon transition-all"></i>';
	$html .= "<a href='https://www.facebook.com/sharer/sharer.php?u=$facebook' title='Share on Facebook' class='link__text' target='_blank'>Facebook</a>";
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-tumblr link__icon transition-all"></i>';
	$html .= "<a href='http://www.tumblr.com/share/link?url=$tumblr' target='_blank' class='link__text'>Tumblr</a>";
	$html .= '</div>';

	$html .= '<div class="link__container ' . $material . '">';
	$html .= '<i class="icon-crucial-mail link__icon transition-all"></i>';
	$html .= "<a href='mailto:?subject=$subject&body=$body' class='link__text'>Email</a>";
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'share-links', 'share_links' );