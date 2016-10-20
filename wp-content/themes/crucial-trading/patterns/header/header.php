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

function header_shortcode($atts = '') {

	$header_size = 'small';

	if ( $atts != '' && $atts['size'] == 'large' ) {
		$header_size = 'large';
	}

	$title = get_the_title();

	$attachment_id = has_post_thumbnail() ? get_post_thumbnail_id() : false;
	$background    = $attachment_id ? wp_get_attachment_image_url( $attachment_id, 'full' ) : '';

	$html = '';

	$html .= '<header class="' . $header_size . '" style="background-image: url(' . $background . ')">';
	$html .= '<h1 class="vertical-align">' . $title . '</h1>';
	$html .= '</header>';

	return $html;
}

add_shortcode( 'header', 'header_shortcode' );

?>
<h6>Header Small</h6>
<?php
echo do_shortcode( '[header]' );
?>
<h6>Header Large</h6>
<?php
echo do_shortcode( '[header size="large"]' );