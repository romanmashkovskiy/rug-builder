<?

if ( count( $videos ) == 0 ) {
	$html .= '<h2>Sorry, there are currently no videos to show.</h2>';
	return;
}

$html .= "<div class='videos'>";

foreach ( $videos as $key => $video ) {

	$scrnsht_id = get_post_meta( $video->ID, 'inspiration_screenshot', true );
	$_scrnsht   = wp_get_attachment_image_src( $scrnsht_id, 'single-post-thumbnail' );
	$scrnsht    = is_array( $_scrnsht ) && array_key_exists( 0, $_scrnsht ) ? $_scrnsht[0] : false;

	$video_id = get_post_meta( $video->ID, 'inspiration_content', true );
	$video    = wp_get_attachment_url( $video_id );

	if ( !$scrnsht || !$video ) {
		return;
	}

	$html .= "<div class='video'>";
	$html .= "<img src='$scrnsht'>";
	$html .= "<a href='$video' class='html5lightbox' data-fullscreenmode='true'>Play Video</a>";
	$html .= "</div>";

}

$html .= '</div>';