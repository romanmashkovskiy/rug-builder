<?php 
/** 
KIJO Framework
Create custom meta boxes

**/

/**
 * Register meta boxes
 *
 * Remember to change "your_prefix" to actual prefix in your project
 *
 * @return void
 */
 
function kijo_framework_register_meta_boxes_2( $meta_boxes )
{
	/**
	 * prefix of meta keys (optional)
	 * Use underscore (_) at the beginning to make keys hidden
	 * Alt.: You also can make prefix empty to disable it
	 */
	// Better has an underscore as last sign
	
	$sitename = kijo_framework_sitename();
	
	$prefix = ''.$sitename.'_';


/************************************************************************************
About Us
*************************************************************************************/
	
	// Two column text introduction 
	$meta_boxes[] = array(
		'title' => __( 'Page introduction - 2 columns', 'meta-box' ),
		'pages' => array( 'page'),
		'priority' => 'high',
		'include' => array( 
			 'template' => array( 'page-about.php')
		),
		'fields' => array(

			// Text
			array(
				// Field name - Will be used as label
				'name'  => __( 'Heading', 'meta-box' ),
				// Field ID, i.e. the meta key
				'id'    => "{$prefix}two-col-intro-heading",
				// Field description (optional)
				'desc'  => __( '', 'meta-box' ),
				'type'  => 'text',
				// Default value (optional)
				'std'   => __( 'Box Heading 1', 'meta-box' ),
				// CLONES: Add to make the field cloneable (i.e. have multiple value)
				'clone' => false,
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id', // Not used, but needed
			),
			// Column 1 - Content
			array(
				'name' => __( 'Column 1 - Content', 'meta-box' ),
				'id'   => "{$prefix}two-col-intro-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 7,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Column 2 - Content
			array(
				'name' => __( 'Column 2 - Content', 'meta-box' ),
				'id'   => "{$prefix}two-col-intro-wysiwyg-2",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 7,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id', 
			),
			// Double column width text
			array(
				'name' => __( 'Double Column', 'meta-box' ),
				'id'   => "{$prefix}double-col-intro-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 7,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),

		)
	);

	// Text image two column feature
	$meta_boxes[] = array(
		'title' => __( 'Text & Image Feature', 'meta-box' ),
		'pages' => array( 'page'),
		'priority' => 'high',
		'include' => array( 
			 'template' => array( 'page-about.php')
		),
		'fields' => array(

			// Text
			array(
				'name'  => __( 'Heading', 'meta-box' ),
				'id'    => "{$prefix}text-image-feature-heading",
				'desc'  => __( '', 'meta-box' ),
				'type'  => 'text',
				'std'   => __( 'Box Heading 1', 'meta-box' ),
				'clone' => false,
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Content
			array(
				'name' => __( 'Content', 'meta-box' ),
				'id'   => "{$prefix}text-image-feature-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 16,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Image
			array(
				'name'             => __( 'Image', 'meta-box' ),
				'id'               => "{$prefix}text-image-feature-imgadv",
				'type'             => 'image_advanced',
				'max_file_uploads' => 1,
			),

		)
	);
	
	
	// Text image alternating grid
	$meta_boxes[] = array(
		'title' => __( 'Text Image - Alternating Grid', 'meta-box' ),
		'pages' => array( 'page'),
		'priority' => 'high',
		'include' => array( 
			 'template' => array( 'page-about.php')
		),
		'fields' => array(

			// Text
			array(
				'name'  => __( 'Heading', 'meta-box' ),
				'id'    => "{$prefix}text-image-alt-grid-heading",
				'desc'  => __( '', 'meta-box' ),
				'type'  => 'text',
				'std'   => __( 'Box Heading 1', 'meta-box' ),
				'clone' => false,
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Content
			array(
				'name' => __( 'Content', 'meta-box' ),
				'id'   => "{$prefix}text-image-alt-grid-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 11,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Image
			array(
				'name'             => __( 'Image', 'meta-box' ),
				'id'               => "{$prefix}text-image-alt-grid-imgadv",
				'type'             => 'image_advanced',
				'max_file_uploads' => 1,
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Content
			array(
				'name' => __( 'Content', 'meta-box' ),
				'id'   => "{$prefix}text-image-alt-grid-2-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 11,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Image
			array(
				'name'             => __( 'Image', 'meta-box' ),
				'id'               => "{$prefix}text-image-alt-grid-2-imgadv",
				'type'             => 'image_advanced',
				'max_file_uploads' => 1,
			),

		)
	);
	
	// Single Column - Floating Images
	$meta_boxes[] = array(
		'title' => __( 'Single Column - Floating Images', 'meta-box' ),
		'pages' => array( 'page'),
		'priority' => 'high',
		'include' => array( 
			 'template' => array( 'page-about.php')
		),
		'fields' => array(

			// Text
			array(
				'name'  => __( 'Heading', 'meta-box' ),
				'id'    => "{$prefix}single-column-floating-heading",
				'desc'  => __( '', 'meta-box' ),
				'type'  => 'text',
				'std'   => __( 'Box Heading 1', 'meta-box' ),
				'clone' => false,
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Content
			array(
				'name' => __( 'Content', 'meta-box' ),
				'id'   => "{$prefix}single-column-floating-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 16,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Image
			array(
				'name'             => __( 'Image Left', 'meta-box' ),
				'id'               => "{$prefix}single-column-floating-imgadv",
				'type'             => 'image_advanced',
				'max_file_uploads' => 1,
			),
			// Image
			array(
				'name'             => __( 'Image Right', 'meta-box' ),
				'id'               => "{$prefix}single-column-floating-2-imgadv",
				'type'             => 'image_advanced',
				'max_file_uploads' => 1,
			),

		)
	);
	
	
/************************************************************************************
Single Kitchens
*************************************************************************************/
	
	// Two column text introduction 
	$meta_boxes[] = array(
		'title' => __( 'Kitchen Descriptions', 'meta-box' ),
		'post_types' => array('kitchens'),
		'priority' => 'low',
		'fields' => array(

			// Short Description
			array(
				'name' => __( 'Short Description', 'meta-box' ),
				'id'   => "{$prefix}kitchens-short-description-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 7,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Full Description
			array(
				'name' => __( 'Full Description', 'meta-box' ),
				'id'   => "{$prefix}kitchens-full-description-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 16,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Thumbnails
			array(
				'name'             => __( 'Image Gallery', 'meta-box' ),
				'id'               => "{$prefix}kitchens-gallery-imgadv",
				'type'             => 'image_advanced',
				//'max_file_uploads' => 20,
			),

		)
	);

		
/************************************************************************************
Case Studies
*************************************************************************************/
	
	// Two column text introduction 
	$meta_boxes[] = array(
		'title' => __( 'Kitchen Descriptions', 'meta-box' ),
		'post_types' => array( 'casestudies'),
		'priority' => 'low',
		/*'include' => array( 
			 'template' => array( 'page-case-studies.php')
		),*/
		'fields' => array(

			// Full Description
			array(
				'name' => __( 'Full Description', 'meta-box' ),
				'id'   => "{$prefix}case-study-full-description-wysiwyg",
				'type' => 'wysiwyg',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'options' => array(
					'textarea_rows' => 16,
					'teeny'         => true,
					'media_buttons' => false,
				),
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Quote
			array(
				'name' => __( 'Quote/Testimonial', 'meta-box' ),
				'id'   => "{$prefix}case-study-quote-wysiwyg",
				'type' => 'textarea',
				'raw'  => false,
				'std'  => __( '', 'meta-box' ),
				'rows' => 5,
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Main Image
			array(
				'name'             => __( 'Main Image', 'meta-box' ),
				'id'               => "{$prefix}case-study-main-image-imgadv",
				'type'             => 'image_advanced',
				'max_file_uploads' => 1,
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Thumbnails
			array(
				'name'             => __( 'Image Gallery', 'meta-box' ),
				'id'               => "{$prefix}case-study-gallery-imgadv",
				'type'             => 'image_advanced',
			),

		)
	);

/************************************************************************************
Contact
*************************************************************************************/

	// Google Map
	$meta_boxes[] = array(
		'title' => __( 'Google Map', 'meta-box' ),
		'post_types' => array( 'post', 'page', 'casestudies'),
		'priority' => 'high',
		'include' => array( 
			'template' => array( 'page-contact.php')
		),
		'fields' => array(

			// Address
			array(
				'id'   => "{$prefix}google-map-address",
				'name' => __( 'Address', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( 'Broadway Kitchens Harbour Yard - Adjacent to Design Center Chelsea SW10 0XE', 'your-prefix' ),
				'size' => 70
			),

		)
	);

	// Enquiry Form
	$meta_boxes[] = array(
		'title' => __( 'Enquiry Form', 'meta-box' ),
		'post_types' => array( 'post', 'page', 'casestudies'),
		'priority' => 'high',
		'include' => array( 
			'template' => array( 'page-contact.php')
		),
		'fields' => array(

			// Description
			array(
				'id'   => "{$prefix}enquiry-form-description",
				'name' => __( 'Description', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( 'Use this contact form to send us an immediate email enquiry. We will call you or reply by email as soon as we can.', 'your-prefix' ),
				'size' => 70
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Contact Form 7
			array(
				'id'   => "{$prefix}contact-form-7",
				'name' => __( 'Contact Form 7 Shortcode', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( '[contact-form-7 id="31" title="Contact us page"]', 'your-prefix' ),
				'size' => 70
			),

		)
	);

	// Contact Details
	$meta_boxes[] = array(
		'title' => __( 'Contact Details', 'meta-box' ),
		'post_types' => array( 'post', 'page'),
		'priority' => 'high',
		'include' => array( 
			'template' => array( 'page-contact.php')
		),
		'fields' => array(

			// Description
			array(
				'id'   => "{$prefix}contact-details-description",
				'name' => __( 'Description', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( 'Give us a call or send us an email:', 'your-prefix' ),
				'size' => 70
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Number
			array(
				'id'   => "{$prefix}contact-details-number",
				'name' => __( 'Phone Number', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( '0207 118 8822', 'your-prefix' ),
				'size' => 70
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Email
			array(
				'id'   => "{$prefix}contact-details-email",
				'name' => __( 'Email', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( 'info@broadwaybespokekitchens.co.uk', 'your-prefix' ),
				'size' => 70
			),
			// Divider
			array(
				'type' => 'divider',
				'id'   => 'fake_divider_id',
			),
			// Address Line 1
			array(
				'id'   => "{$prefix}contact-details-address-1",
				'name' => __( 'Address Line 1', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( 'Broadway Kitchens', 'your-prefix' ),
				'size' => 70
			),
			// Address Line 2
			array(
				'id'   => "{$prefix}contact-details-address-2",
				'name' => __( 'Address Line 2', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( 'Harbour Yard - Adjacent to Design Center Chelsea', 'your-prefix' ),
				'size' => 70
			),
			// Address Line 3
			array(
				'id'   => "{$prefix}contact-details-address-3",
				'name' => __( 'Address Line 3', 'your-prefix' ),
				'type' => 'text',
				'std'  => __( 'SW10 0XE', 'your-prefix' ),
				'size' => 70
			),

		)
	);
	
	
	return $meta_boxes;
}

add_filter( 'rwmb_meta_boxes', 'kijo_framework_register_meta_boxes_2' );

?>