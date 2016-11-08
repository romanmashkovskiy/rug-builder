<?php

/**
 * Custom Post Type - Super Slider
 *
 * Contents:
 * Page Subtitle
 * Section Boxes
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

add_filter( 'rwmb_meta_boxes', 'meta_boxes' );

function meta_boxes($meta_boxes) {

	// Page Subtitle

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

	// Section Boxes

	$meta_boxes[] = array(
		'title'      => 'Section Boxes',
		'post_types' => 'page',
		'fields'     => array(
			array(
				'name'       => 'Section Box',
				'id'         => 'boxes',
				'type'       => 'group',
				'clone'      => true,
				'sort_clone' => true,
				'fields'     => array(
					array(
						'name'    => 'Image Side',
						'id'      => 'side',
						'type'    => 'select',
						'options' => array( 'left' => 'Left', 'right' => 'Right' ),
					),
					array(
						'name' => 'Title',
						'id'   => 'title',
						'type' => 'text',
					),
					array(
						'name' => 'Subtitle',
						'id'   => 'subtitle',
						'type' => 'text',
					),
					array(
						'name' => 'Text',
						'id'   => 'text',
						'type' => 'textarea',
					),
					array(
						'name' => 'Link Text',
						'id'   => 'link-text',
						'type' => 'text',
					),
					array(
						'name'      => 'Link',
						'id'        => 'link-href',
						'type'      => 'post',
						'post_type' => array( 'post', 'page' ),
					),
					array(
						'name'        => 'Image',
						'id'          => 'image',
						'type'        => 'image_advanced',
						'max_uploads' => 1,
					),
				),
			),
		),
	);

	// Page Images

	$meta_boxes[] = array(
		'title'      => 'Page Images',
		'post_types' => 'page',
		'fields'     => array(
			array(
				'name'        => 'Standard Image',
				'id'          => 'standard_image',
				'type'        => 'image_advanced',
				'max_uploads' => 1,
			),
			array(
				'name' => 'Tag',
				'id'   => 'standard_tag',
				'type' => 'text',
			),
			array(
				'name'       => 'Other Images',
				'id'         => 'other_images',
				'type'       => 'group',
				'clone'      => true,
				'sort_clone' => true,
				'fields'     => array(
					array(
						'name'        => 'Image',
						'id'          => 'other_image',
						'type'        => 'image_advanced',
						'max_uploads' => 1,
					),
					array(
						'name' => 'Tag',
						'id'   => 'image_tag',
						'type' => 'text',
					),
				),
			),
		),
	);

	return $meta_boxes;
}