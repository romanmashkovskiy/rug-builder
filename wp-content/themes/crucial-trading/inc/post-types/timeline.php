<?php

/**
 * Custom Post Type - Timeline
 *
 * Contents:
 * Register Post Type
 * Meta Boxes
 * Columns
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

// Register Post Type

add_action( 'init', 'regiser_timeline_post_type' );

function regiser_timeline_post_type() {

	$labels = array(
		'name'               => _x( 'Timeline', 'slider' ),
		'singular_name'      => _x( 'Timeline', 'slider' ),
		'add_new'            => _x( 'Add New', 'slider' ),
		'add_new_item'       => __( 'Add New Entry' ),
		'edit_item'          => __( 'Edit Entry Content' ),
		'new_item'           => __( 'New Entry Content' ),
		'all_items'          => __( 'All Entries' ),
		'view_item'          => __( 'View Entry' ),
		'search_items'       => __( 'Search Entry' ),
		'not_found'          => __( 'No entries found' ),
		'not_found_in_trash' => __( 'No entries found in Trash' ), 
		'menu_name'          => 'Our Story Timeline'
	);

	$args = array(
		'labels'              => $labels,
		'description'         => 'Used to construct the about page Our Story timeline.',
		'public'              => true,
		'query_var'           => "timeline",
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
		'supports'            => array( 'page-attributes' )
	); 

	register_post_type( 'timeline', $args );
}

// Meta Boxes

add_filter( 'rwmb_meta_boxes', 'timeline_meta_boxes' );

function timeline_meta_boxes( $meta_boxes ) {

	$meta_boxes[] = array(
		'title'      => 'Information',
		'post_types' => 'timeline',
		'fields'     => array(
			array(
				'name'      => 'Year',
				'id'        => 'timeline-year',
				'type'      => 'number',
			),
			array(
				'name'     => 'Title',
				'id'       => 'timeline-title',
				'type'     => 'text',
			),
			array(
				'name'     => 'Content',
				'id'       => 'timeline-content',
				'type'     => 'textarea',
			),
		),
	);

	return $meta_boxes;
}

// Columns

add_filter('manage_timeline_posts_columns' , 'add_timeline_columns');

function add_timeline_columns( $columns ) {

    return array(
    	'cb'      => '<input type="checkbox" />',
    	'year'    => __('Year'),
    	'm_title' => __('Title'),
    	'date'    => __('Date'),
    );
}

add_action( 'manage_posts_custom_column' , 'custom_columns', 10, 2 );

function custom_columns( $column, $post_id ) {

	switch ( $column ) {

		case 'year' :

			$link = get_edit_post_link( $post_id );
			$year = rwmb_meta( 'timeline-year', array(), $post_id );

			echo "<a href='$link'>$year</a>";

			break;

		case 'm_title' :

			$title = rwmb_meta( 'timeline-title', array(), $post_id );

			echo "<p>$title</p>";

			break;
	}

}