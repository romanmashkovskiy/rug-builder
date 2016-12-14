<?php

/**
 * Custom Post Type - Super Slider
 *
 * Contents:
 * Register Post Type
 * Meta Boxes
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

// Register Post Type

add_action( 'init', 'regiser_super_slider_post_type' );

function regiser_super_slider_post_type() {

	$labels = array(
		'name'               => _x( 'Home Slider', 'slider' ),
		'singular_name'      => _x( 'Slider', 'slider' ),
		'add_new'            => _x( 'Add New', 'slider' ),
		'add_new_item'       => __( 'Add New Slider' ),
		'edit_item'          => __( 'Edit Slider Content' ),
		'new_item'           => __( 'New Slider Content' ),
		'all_items'          => __( 'All Home Slides' ),
		'view_item'          => __( 'View Slider' ),
		'search_items'       => __( 'Search Slider' ),
		'not_found'          => __( 'No slides found' ),
		'not_found_in_trash' => __( 'No slides found in Trash' ), 
		'menu_name'          => 'Home Slider'
	);

	$args = array(
		'labels'              => $labels,
		'description'         => 'Used to construct the full screen homepage slider.',
		'public'              => true,
		'query_var'           => "super-slider", // This goes to the WP_Query schema
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
		'supports'            => array( 'title','thumbnail','revisions','page-attributes' )
	); 

	register_post_type( 'super-slider', $args );
}

// Meta Boxes

add_filter( 'rwmb_meta_boxes', 'super_slider_meta_boxes' );

function super_slider_meta_boxes( $meta_boxes ) {

	$meta_boxes[] = array(
		'title'      => 'Slide',
		'post_types' => 'super-slider',
		'fields'     => array(
			array(
				'name'      => 'Link Text',
				'id'        => 'link-text',
				'type'      => 'text',
			),
			array(
				'name'     => 'Link',
				'id'       => 'link',
				'type'     => 'taxonomy',
				'taxonomy' => 'product_tag',
			),
		),
	);

	return $meta_boxes;
}