<?php
/**
 * Template Name: Retailer
 *
 * The find a retailer page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

if ( array_key_exists( 'get_retailers', $_GET ) ) {

	$type = $_GET['get_retailers'];

	$args = array(
		'post_type' => 'retailer',
		'tax_query' => array(
			array(
				'taxonomy' => 'retailer_type',
				'field'    => 'slug',
				'terms'    => $type,
			),
		),
	);

	$query = new WP_Query( $args );

	for ( $i = 0; $i < $query->post_count; $i++ ) {

		$post    = $query->posts[$i];
		$post_id = $post->ID;

		$lat     = get_post_meta( $post_id, 'lat', true );
		$lng     = get_post_meta( $post_id, 'lng', true );

		$post->lat     = $lat;
		$post->lng     = $lng;
	}

	echo json_encode( $query->posts );

	die();
}

$showroom_args = array(
	'post_type' => 'retailer',
	'tax_query' => array(
		array(
			'taxonomy' => 'retailer_type',
			'field'    => 'slug',
			'terms'    => 'showroom',
		),
	),
);

$showroom_query = new WP_Query( $showroom_args );

$online_args = array(
	'post_type' => 'retailer',
	'tax_query' => array(
		array(
			'taxonomy' => 'retailer_type',
			'field'    => 'slug',
			'terms'    => 'online',
		),
	),
);

$online_query = new WP_Query( $online_args );

get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[retailer-search-box]' );

echo do_shortcode( '[google-map]' );

if ( array_key_exists( 'results', $_GET ) ) {

	$results = explode( ',', $_GET['results'] );

	for ( $i = 0; $i < count( $results ); $i++ ) {
		$dash = strpos( $results[$i], '-' );
		$id   = substr( $results[$i], 0, $dash );
		$dist = substr( $results[$i], $dash + 1 );
		echo do_shortcode( '[retailer-card id="' . $id . '" distance="' . $dist . '"]' );
	}	
}

if ( $showroom_query->have_posts() ) :

	echo '<h2>Our Showrooms</h2>';

	for ( $i2 = 0; $i2 < $showroom_query->post_count; $i2++ ) {
		echo do_shortcode( '[showroom-card type="showroom" id="' . $showroom_query->posts[$i2]->ID . '"]' );
	}

endif;

if ( $online_query->have_posts() ) :

	echo '<h2>Online Retailers</h2>';

	for ( $i3 = 0; $i3 < $online_query->post_count; $i3++ ) {
		echo do_shortcode( '[showroom-card type="online" id="' . $online_query->posts[$i3]->ID . '"]' );
	}

endif;

get_footer();