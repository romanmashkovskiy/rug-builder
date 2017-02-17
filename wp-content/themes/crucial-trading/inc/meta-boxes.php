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

	
	// Product 3D Maps 

	$meta_boxes[] = array(
		'title'      => '3D Rug Builder Images',
		'post_types' => 'product',
		'fields'     => array(
			array(
				'name'     => 'Texture',
				'id'       => 'rb_texture',
				'type'        => 'image_advanced',
				'max_uploads' => 1,
				'priority' => 'high',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'        => 'divider',
			),
			array(
				'name'     => 'Texture Portrait',
				'id'       => 'rb_texture_portrait',
				'type'        => 'image_advanced',
				'max_uploads' => 1,
				'priority' => 'high',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'        => 'divider',
			),
			array(
				'name'     => 'Texture Repeat X (Center/Outer Border)',
				'id'       => 'rb_repeat_x',
				'type'     => 'text',
				'priority' => 'high',
				'desc'     => 'Defaults: Center - 7, Border - 10',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'     => 'divider',
			),
			array(
				'name'     => 'Texture Repeat Y (Center/Outer Border)',
				'id'       => 'rb_repeat_y',
				'type'     => 'text',
				'priority' => 'high',
				'desc'     => 'Defaults: Center - 7, Border - 10',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'     => 'divider',
			),
			array(
				'name'     => 'Texture Repeat X (Inner Border)',
				'id'       => 'rb_repeat_x_inner',
				'type'     => 'text',
				'priority' => 'high',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'     => 'divider',
			),
			array(
				'name'     => 'Texture Repeat Y (Inner Border)',
				'id'       => 'rb_repeat_y_inner',
				'type'     => 'text',
				'priority' => 'high',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'     => 'divider',
			),
			array(
				'name'     => 'Stitching Colour',
				'id'       => 'rb_stitching_colour',
				'type'     => 'color',
				'priority' => 'high',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'     => 'divider',
			),
			array(
				'name'     => 'Bump Map',
				'id'       => 'rb_bump_map',
				'type'        => 'image_advanced',
				'max_uploads' => 1,
				'priority' => 'high',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'        => 'divider',
			),
			array(
				'name'     => 'Normal Map',
				'id'       => 'rb_normal_map',
				'type'        => 'image_advanced',
				'max_uploads' => 1,
				'priority' => 'high',
			),
			array(
				'name'     => 'divider',
				'id'       => 'divider',
				'type'        => 'divider',
			),
			array(
				'name'     => 'Displacement Map',
				'id'       => 'rb_displacement_map',
				'type'        => 'image_advanced',
				'max_uploads' => 1,
				'priority' => 'high',
			),
		),
	);


	// Product Category Subtitle

	$meta_boxes[] = array(
		'title'      => 'Category Subtitle',
		'post_types' => 'product',
		'include' => array(
			'product_cat' => array('coir', 'seagrass', 6, 'Coir'),
		),
		'fields'     => array(
			array(
				'name'     => 'Subtitle',
				'id'       => 'subtitle',
				'type'     => 'text',
				'priority' => 'normal',
			),
		),
	);

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

	// Home Page Inspiration Text

	$meta_boxes[] = array(
		'title'      => 'Inspiration Text',
		'post_types' => 'page',
		'fields'     => array(
			array(
				'name' => 'Subtitle',
				'id'   => 'insp_sub',
				'type' => 'text',
			),
			array(
				'name' => 'Title',
				'id'   => 'insp_title',
				'type' => 'text',
			),
			array(
				'name' => 'Content',
				'id'   => 'insp_text',
				'type' => 'textarea',
			),
		),
	);

/*
	// Home Page Call to Actions

	$meta_boxes[] = array(
		'title'      => 'Home Page Call to Action',
		'post_types' => 'page',
		'include'    => array( 'slug' => 'home' ),
		'fields'     => array(
			array(
				'name'       => 'Call to Action',
				'id'         => 'home-page-cta',
				'type'       => 'group',
				'clone'      => true,
				'sort_clone' => true,
				'fields'     => array(
					array(
						'name' => 'Title',
						'id'   => 'title',
						'type' => 'text',
					),
					array(
						'name' => 'Text',
						'id'   => 'text',
						'type' => 'text',
					),
					array(
						'name' => 'Background Color',
						'id'   => 'bg-color',
						'type' => 'color',
					),
					array(
						'name' => 'Icon',
						'id'   => 'icon',
						'type' => '????',
					),
				),
			),
		),
	);
*/
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