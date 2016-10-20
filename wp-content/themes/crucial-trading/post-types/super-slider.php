<?php

/**
 * The super slider post type 
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
		'name'               => 'Home Slider',
		'singular_name'      => 'Home Slider',
		'add_new_item'       => 'Add New Slide',
		'edit_item'          => 'Edit Slide',
		'new_item'           => 'New Slide',
		'view_item'          => 'View Slide',
		'not_found'          => 'No slides found',
		'not_found_in_trash' => 'No slides found in Trash',
		'all_items'          => 'All Slides'	
	);

	$args = array(
		'labels'              => $labels,
		'description'         => 'Home page slides',
		'exclude_from_search' => true,
		'publicly_queryable'  => false,
		'show_ui'             => true,
		'show_in_nav_menus'   => false,
		'show_in_menu'        => true,
		'show_in_admin_bar'   => false,
		'menu_position'       => 25,
		'capability_type'     => 'post',
		'supports'            => array( 'title', 'thumbnail', 'page-attributes' ),
		'has_archive'         => false,
		'query_var'           => false,
		'menu_icon'	          => 'dashicons-format-gallery'
	);

	register_post_type( 'super-slider', $args );
}

// Meta Boxes

add_filter( 'rwmb_meta_boxes', 'super_slider_meta_boxes' );

function super_slider_meta_boxes($meta_boxes) {

	$meta_boxes[] = array(
		'title'      => 'Slide',
		'post_types' => 'super-slider',
		'fields'     => array(
			array(
				'name'      => 'Link',
				'id'        => 'link',
				'type'      => 'post',
				'post_type' => array( 'post', 'page' ),
			),
		),
	);

	return $meta_boxes;
}