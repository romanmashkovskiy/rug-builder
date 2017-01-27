<?php

/**
 * Custom Post Type - Inspiration
 *
 * Contents:
 * Register Post Type
 * Meta Boxes
 * Custom Taxonomies
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

// Register Post Type

add_action( 'init', 'regiser_inspiration_post_type' );

function regiser_inspiration_post_type() {

	$labels = array(
		'name'               => _x( 'Inspiration Content', 'retailer' ),
		'singular_name'      => _x( 'Inspiration Content', 'retailer' ),
		'add_new'            => _x( 'Add New', 'retailer' ),
		'add_new_item'       => __( 'Add New Content' ),
		'edit_item'          => __( 'Edit Content' ),
		'new_item'           => __( 'New Content' ),
		'all_items'          => __( 'All Content' ),
		'view_item'          => __( 'View Content' ),
		'search_items'       => __( 'Search Content' ),
		'not_found'          => __( 'No content found' ),
		'not_found_in_trash' => __( 'No content found in Trash' ), 
		'menu_name'          => 'Inspiration Content'
	);

	$args = array(
		'labels'              => $labels,
		'description'         => 'Used for the inspiration page.',
		'public'              => true,
		'query_var'           => "inspiration", // This goes to the WP_Query schema
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
		'supports'            => array( 'title', 'page-attributes' ),
	); 

	register_post_type( 'inspiration', $args );
}

// Meta Boxes

add_filter( 'rwmb_meta_boxes', 'inspiration_meta_boxes' );

function inspiration_meta_boxes( $meta_boxes ) {

	$meta_boxes[] = array(
		'title'      => 'Details',
		'post_types' => 'inspiration',
		'fields'     => array(
			array(
				'name'      => 'Content',
				'id'        => 'inspiration_content',
				'type'      => 'file_advanced',
			),
			array(
				'name'      => 'Video Screenshot',
				'id'        => 'inspiration_screenshot',
				'type'      => 'file_advanced',
			),
		),
	);

	return $meta_boxes;
}

// Custom Taxonomies

add_action( 'init', 'register_inspiration_taxnomies' );

function register_inspiration_taxnomies() {

	$labels = array(
		'name'              => _x( 'Inspiration Types', 'taxonomy general name', 'retailer' ),
		'singular_name'     => _x( 'Inspiration Type', 'taxonomy singular name', 'retailer' ),
		'search_items'      => __( 'Search Types', 'retailer' ),
		'all_items'         => __( 'All Types', 'retailer' ),
		'edit_item'         => __( 'Edit Type', 'retailer' ),
		'update_item'       => __( 'Update Type', 'retailer' ),
		'add_new_item'      => __( 'Add New Type', 'retailer' ),
		'new_item_name'     => __( 'New Type Name', 'retailer' ),
		'menu_name'         => __( 'Inspiration Types', 'retailer' ),
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'query_var'         => true,
		'show_admin_column' => true,
	);

	register_taxonomy( 'inspiration_type', 'inspiration', $args );

	$room_shot_exists = term_exists( 'Room Shot', 'inspiration_type' );

	if ( !$room_shot_exists ) {
		
		$abc = wp_insert_term(
			'Room Shot',
			'inspiration_type',
			array(
				'slug' => 'room-shot',
			)
		);
	}

	$video_exists = term_exists( 'Video', 'inspiration_type' );

	if ( !$video_exists ) {
		
		$abc = wp_insert_term(
			'Video',
			'inspiration_type',
			array(
				'slug' => 'video',
			)
		);
	}
}