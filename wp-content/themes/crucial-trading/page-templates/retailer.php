<?php
/**
 * Template Name: Retailer
 *
 * The find a retailer page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

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

echo do_shortcode( '[google-map]' );

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