<?

/**
* ADd a subtitle meta box to pages
*
* Contents:
*
* @package Crucial Trading
* @since Crucial Trading 1.0
*/

add_filter( 'rwmb_meta_boxes', 'suubtitle_meta_boxe' );

function suubtitle_meta_boxe($meta_boxes) {

	$meta_boxes[] = array(
		'title'      => 'Page Subtitle',
		'post_types' => 'page',
		'fields'     => array(
			array(
				'name'     => 'Subtitle',
				'id'       => 'subtitle',
				'type'     => 'text',
				'priority' => 'high',
			),
		),
	);

	return $meta_boxes;
}