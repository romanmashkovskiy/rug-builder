<?php

/**
 * Custom Post Type - Timeline
 *
 * Contents:
 * Register Post Type
 * Meta Boxes
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

// Register Post Type

add_action( 'init', 'regiser_scroller_post_type' );

function regiser_scroller_post_type() {

	$labels = array(
		'name'               => _x( 'Scroller', 'slider' ),
		'singular_name'      => _x( 'Scroller', 'slider' ),
		'add_new'            => _x( 'Add New', 'slider' ),
		'add_new_item'       => __( 'Add New Entry' ),
		'edit_item'          => __( 'Edit Entry Content' ),
		'new_item'           => __( 'New Entry Content' ),
		'all_items'          => __( 'All Entries' ),
		'view_item'          => __( 'View Entry' ),
		'search_items'       => __( 'Search Entry' ),
		'not_found'          => __( 'No entries found' ),
		'not_found_in_trash' => __( 'No entries found in Trash' ), 
		'menu_name'          => 'Our Process Scroller'
	);

	$args = array(
		'labels'              => $labels,
		'description'         => 'Used to construct the about page Our Process scroller.',
		'public'              => true,
		'query_var'           => 'scroller',
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_ui'             => true, 
		'show_in_menu'        => true, 
		'query_var'           => true,
		'rewrite'             => true,
		'capability_type'     => 'post',
		'map_meta_cap'        => true,
		'has_archive'         => false, 
		'hierarchical'        => false,
		'menu_position'       => 5,
		'menu_icon'           => 'dashicons-images-alt2',
		'supports'            => array( 'title', 'page-attributes' )
	); 

	register_post_type( 'scroller', $args );
}

// Meta Boxes

add_filter( 'rwmb_meta_boxes', 'scoller_meta_boxes' );

function scoller_meta_boxes( $meta_boxes ) {

	$meta_boxes[] = array(
		'title'      => 'Information',
		'post_types' => 'scroller',
		'fields'     => array(
			array(
				'name'      => 'Image',
				'id'        => 'scroller-image',
				'type'      => 'file_advanced',
			),
			array(
				'name'     => 'Content',
				'id'       => 'scroller-content',
				'type'     => 'textarea',
			),
		),
	);

	return $meta_boxes;
}