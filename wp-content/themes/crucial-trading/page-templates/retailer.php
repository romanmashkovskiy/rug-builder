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

		$address = rwmb_meta( 'address', array(), $post_id );
		$phone   = rwmb_meta( 'phone', array(), $post_id );
		$website = rwmb_meta( 'website', array(), $post_id );
		$email   = rwmb_meta( 'email  ', array(), $post_id );
		$lat     = get_post_meta( $post_id, 'lat', true );
		$lng     = get_post_meta( $post_id, 'lng', true );

		$post->address = $address;
		$post->phone   = $phone;
		$post->website = $website;
		$post->email   = $email;
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

	echo '<pre>';
	print_r($results);
	echo '</pre>';
}

if ( $showroom_query->have_posts() ) :

	echo '<h2>Our Showrooms</h2>';

	for ( $i = 0; $i < $showroom_query->post_count; $i++ ) {
		echo do_shortcode( '[showroom-card type="showroom" id="' . $showroom_query->posts[$i]->ID . '"]' );
	}

endif;

if ( $online_query->have_posts() ) :

	echo '<h2>Online Retailers</h2>';

	for ( $i = 0; $i < $online_query->post_count; $i++ ) {
		echo do_shortcode( '[showroom-card type="online" id="' . $online_query->posts[$i]->ID . '"]' );
	}

endif;

get_footer();