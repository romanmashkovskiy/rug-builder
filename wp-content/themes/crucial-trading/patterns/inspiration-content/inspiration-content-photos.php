<?php

if ( count( $photos ) == 0 ) {
	$html .= '<h2>Sorry, there are currently no room shots to show.</h2>';
	return;
}

$html .= "<div class='grid'>";

foreach ( $photos as $key => $photo ) {

	$image_id = get_post_meta( $photo->ID, 'inspiration_content', true );
	$_src     = wp_get_attachment_image_src( $image_id, 'single-post-thumbnail' );
	$src      = is_array( $_src ) && array_key_exists( 0, $_src ) ? $_src[0] : false;

	if ( !$src ) {
		return;
	}

	$html .= "<div class='grid-item'>";
	$html .= "<img src='$src'>";
	$html .= "</div>";

}

$html .= '</div>';