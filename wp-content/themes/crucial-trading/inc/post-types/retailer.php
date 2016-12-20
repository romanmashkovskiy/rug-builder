<?php

/**
 * Custom Post Type - Retailer
 *
 * Contents:
 * Register Post Type
 * Meta Boxes
 * Custom Taxonomies
 * Save Lat/Lng as Post Meta
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

// Register Post Type

add_action( 'init', 'regiser_retailer_post_type' );

function regiser_retailer_post_type() {

	$labels = array(
		'name'               => _x( 'Retailers', 'retailer' ),
		'singular_name'      => _x( 'Retailer', 'retailer' ),
		'add_new'            => _x( 'Add New', 'retailer' ),
		'add_new_item'       => __( 'Add New Retailer' ),
		'edit_item'          => __( 'Edit Retailer' ),
		'new_item'           => __( 'New Retailer' ),
		'all_items'          => __( 'All Retailers' ),
		'view_item'          => __( 'View Retailer' ),
		'search_items'       => __( 'Search Retailer' ),
		'not_found'          => __( 'No retailer found' ),
		'not_found_in_trash' => __( 'No retailer found in Trash' ), 
		'menu_name'          => 'Retailers'
	);

	$args = array(
		'labels'              => $labels,
		'description'         => 'Used in the Find Retailers section.',
		'public'              => true,
		'query_var'           => "retailer", // This goes to the WP_Query schema
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_ui'             => true, 
		'show_in_menu'        => true, 
		'query_var'           => true,
		'rewrite'             => true,
		'capability_type'     => 'post',
		'map_meta_cap'        => true, // Make individual post rights work e.g. edit_post
		'has_archive'         => false, 
		'hierarchical'        => false,
		'menu_position'       => 5,
		'menu_icon'           => 'dashicons-images-alt2',
		'supports'            => array( 'title', 'page-attributes', 'custom-fields' ),
	); 

	register_post_type( 'retailer', $args );
}

// Meta Boxes

add_filter( 'rwmb_meta_boxes', 'retailer_meta_boxes' );

function retailer_meta_boxes( $meta_boxes ) {

	$meta_boxes[] = array(
		'title'      => 'Details',
		'post_types' => 'retailer',
		'fields'     => array(
			array(
				'name'      => 'Address Line 1',
				'id'        => 'retailer_address_1',
				'type'      => 'text',
			),
			array(
				'name'      => 'Address Line 2',
				'id'        => 'retailer_address_2',
				'type'      => 'text',
			),
			array(
				'name'      => 'Address Line 3',
				'id'        => 'retailer_address_3',
				'type'      => 'text',
			),
			array(
				'name'      => 'Address Line 4',
				'id'        => 'retailer_address_4',
				'type'      => 'text',
			),
			array(
				'name'      => 'Address Line 5',
				'id'        => 'retailer_address_5',
				'type'      => 'text',
			),
			array(
				'name'      => 'Postcode',
				'id'        => 'retailer_address_postcode',
				'type'      => 'text',
			),
			array(
				'name'      => 'Phone Number',
				'id'        => 'retailer_telephone_1',
				'type'      => 'number',
			),
			array(
				'name'      => 'Email Address',
				'id'        => 'retailer_email',
				'type'      => 'email',
			),
			array(
				'name'      => 'Website',
				'id'        => 'retailer_website',
				'type'      => 'url',
			),
			array(
				'name'      => 'Country',
				'id'        => 'retailer_country',
				'type'      => 'text',
			),
		),
	);

	return $meta_boxes;
}

// Custom Taxonomies

add_action( 'init', 'register_retailer_taxnomies' );

function register_retailer_taxnomies() {

	$labels = array(
		'name'              => _x( 'Retailer Types', 'taxonomy general name', 'retailer' ),
		'singular_name'     => _x( 'Retailer Type', 'taxonomy singular name', 'retailer' ),
		'search_items'      => __( 'Search Types', 'retailer' ),
		'all_items'         => __( 'All Types', 'retailer' ),
		'edit_item'         => __( 'Edit Type', 'retailer' ),
		'update_item'       => __( 'Update Type', 'retailer' ),
		'add_new_item'      => __( 'Add New Type', 'retailer' ),
		'new_item_name'     => __( 'New Type Name', 'retailer' ),
		'menu_name'         => __( 'Retailer Types', 'retailer' ),
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'query_var'         => true,
		'show_admin_column' => true,
	);

	register_taxonomy( 'retailer_type', 'retailer', $args );

	$showroom_exists = term_exists( 'Showroom', 'retailer_type' );

	if ( !$showroom_exists ) {
		
		$abc = wp_insert_term(
			'Showroom',
			'retailer_type',
			array(
				'slug' => 'showroom',
			)
		);
	}

	$retailer_exists = term_exists( 'Retailer', 'retailer_type' );

	if ( !$retailer_exists ) {
		
		$abc = wp_insert_term(
			'Retailer',
			'retailer_type',
			array(
				'slug' => 'retailer',
			)
		);
	}

	$online_exists = term_exists( 'Online', 'retailer_type' );

	if ( !$online_exists ) {
		
		$abc = wp_insert_term(
			'Online',
			'retailer_type',
			array(
				'slug' => 'online',
			)
		);
	}

	$overseas_exists = term_exists( 'Overseas', 'retailer_type' );

	if ( !$overseas_exists ) {
		
		$abc = wp_insert_term(
			'Overseas',
			'retailer_type',
			array(
				'slug' => 'overseas',
			)
		);
	}
}

// Save Lat/Lng as Post Meta

add_action( 'save_post', 'save_retailer_post', 10, 3 );

function save_retailer_post( $post_id, $post, $update ) {

	$post_type = get_post_type( $post_id );

	if ( $post_type != 'retailer' ) {
		return;
	}

	$address_1 = rwmb_meta( 'retailer_address_1', array(), $post_id );
	$address_2 = rwmb_meta( 'retailer_address_2', array(), $post_id );
	$address_3 = rwmb_meta( 'retailer_address_3', array(), $post_id );
	$address_4 = rwmb_meta( 'retailer_address_4', array(), $post_id );
	$address_5 = rwmb_meta( 'retailer_address_5', array(), $post_id );
	$address_6 = rwmb_meta( 'retailer_town', array(), $post_id );
	$address_7 = rwmb_meta( 'retailer_county', array(), $post_id );
	$address_8 = rwmb_meta( 'retailer_postcode', array(), $post_id );

	$address = '';

	if ( $address_1 != '' ) {
		$address .= $address_1;
	}
	if ( $address_2 != '' ) {
		$address .= " " . $address_2;
	}
	if ( $address_3 != '' ) {
		$address .= " " . $address_3;
	}
	if ( $address_4 != '' ) {
		$address .= " " . $address_4;
	}
	if ( $address_5 != '' ) {
		$address .= " " . $address_5;
	}
	if ( $address_6 != '' ) {
		$address .= " " . $address_6;
	}
	if ( $address_7 != '' ) {
		$address .= " " . $address_7;
	}
	if ( $address_8 != '' ) {
		$address .= " " . $address_8;
	}

	$url_address = urlencode($address);

	$url  = "http://maps.google.com/maps/api/geocode/json?address={$url_address}";
	$json = file_get_contents($url);
	$resp = json_decode($json, true);

	if ( $resp['status'] != 'OK' ) {
		return;
	}

	$lat = $resp['results'][0]['geometry']['location']['lat'];
	$lng = $resp['results'][0]['geometry']['location']['lng'];

	update_post_meta( $post_id, 'retailer_lat', $lat );
	update_post_meta( $post_id, 'retailer_lng', $lng );
}


















