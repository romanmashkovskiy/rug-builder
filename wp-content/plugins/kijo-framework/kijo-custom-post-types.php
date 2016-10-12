<?php 
/** 
KIJO Framework
Custom post types 

**/

/************************************************************************************
* Super Full Screen Slider
*************************************************************************************/

add_action('init', 'broadway_custom_slider');
function broadway_custom_slider() 
{
  $labels = array(
    'name' => _x('Home Slider', 'slider'),
    'singular_name' => _x('Slider', 'slider'),
    'add_new' => _x('Add New', 'slider'),
    'add_new_item' => __('Add New Slider'),
    'edit_item' => __('Edit Slider Content'),
    'new_item' => __('New Slider Content'),
    'all_items' => __('All Home Slides'),
    'view_item' => __('View Slider'),
    'search_items' => __('Search Slider'),
    'not_found' =>  __('No content found'),
    'not_found_in_trash' => __('No content found in Trash'), 
    'parent_item_colon' => '',
    'menu_name' => 'Home Slider'

  );
  $args = array(
    'labels' => $labels,
    'description' => 'Used to construct the full screen homepage slider.',
    'public' => true,
	  'query_var' => "slider", // This goes to the WP_Query schema
    'publicly_queryable' => false,
    'exclude_from_search' => true,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
    'capability_type' => 'post',
    		/*'capabilities' => array(
				'publish_posts' => 'publish_site_posts',
				'edit_posts' => 'edit_site_posts',
				'edit_others_posts' => 'edit_others_site',
				'delete_posts' => 'delete_site_posts',
				'delete_others_posts' => 'delete_others_site',
				'read_private_posts' => 'read_private_site',
				/*'edit_post' => 'edit_site',
				'delete_post' => 'delete_site',
				'read_post' => 'read_site',*/
			//),
			'map_meta_cap' => true, // Make individual post rights work e.g. edit_post
			'has_archive' => false, 
			'hierarchical' => false,
			'menu_position' => 5,
			'menu_icon' => 'dashicons-images-alt2',
			//'rewrite' => array("slug" => "slider"), // Permalinks format
			'supports' => array('title','thumbnail','revisions','page-attributes')
  ); 
  register_post_type('slider',$args);
}


/************************************************************************************
* Kitchens 
*************************************************************************************/

add_action('init', 'broadway_custom_kitchens');
function broadway_custom_kitchens() 
{
  $labels = array(
    'name' => _x('Kitchens', 'kitchens'),
    'singular_name' => _x('Kitchens', 'kitchens'),
    'add_new' => _x('Add New', 'kitchens'),
    'add_new_item' => __('Add New Kitchens'),
    'edit_item' => __('Edit Kitchens Content'),
    'new_item' => __('New Kitchens Content'),
    'all_items' => __('All Kitchens'),
    'view_item' => __('View Kitchens'),
    'search_items' => __('Search Kitchens'),
    'not_found' =>  __('No content found'),
    'not_found_in_trash' => __('No content found in Trash'), 
    'parent_item_colon' => '',
    'menu_name' => 'Kitchens'

  );
  $args = array(
    'labels' => $labels,
    'description' => 'Used to construct the full screen homepage slider.',
    'public' => true,
	  'query_var' => "kitchens", // This goes to the WP_Query schema
    'publicly_queryable' => true,
    'exclude_from_search' => true,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
    'capability_type' => 'post',
		'map_meta_cap' => true, // Make individual post rights work e.g. edit_post
		'has_archive' => false, 
		'hierarchical' => false,
		'menu_position' => 5,
		'menu_icon' => 'dashicons-visibility',
		'rewrite' => array("slug" => "kitchens"), // Permalinks format
		'supports' => array('title','thumbnail','revisions')
  ); 
  register_post_type('kitchens',$args);
  flush_rewrite_rules();
}

/************************************************************************************
* Case Studies
*************************************************************************************/

add_action('init', 'broadway_custom_casestudies');
function broadway_custom_casestudies() 
{
  $labels = array(
    'name' => _x('Case Studies', 'casestudies'),
    'singular_name' => _x('Case Studies', 'casestudies'),
    'add_new' => _x('Add New', 'casestudies'),
    'add_new_item' => __('Add New Case Studies'),
    'edit_item' => __('Edit Case Studies Content'),
    'new_item' => __('New Case Studies Content'),
    'all_items' => __('All Case Studies'),
    'view_item' => __('View Case Studies'),
    'search_items' => __('Search Case Studies'),
    'not_found' =>  __('No content found'),
    'not_found_in_trash' => __('No content found in Trash'), 
    'parent_item_colon' => '',
    'menu_name' => 'Case Studies'

  );
  $args = array(
    'labels' => $labels,
    'description' => 'Used to construct the full screen homepage slider.',
    'public' => true,
	  'query_var' => "casestudies", // This goes to the WP_Query schema
    'publicly_queryable' => true,
    'exclude_from_search' => true,
    'show_ui' => true, 
    'show_in_menu' => true, 
    'query_var' => true,
    'rewrite' => true,
    'capability_type' => 'post',
		'map_meta_cap' => true, // Make individual post rights work e.g. edit_post
		'has_archive' => false, 
		'hierarchical' => false,
		'menu_position' => 5,
		'menu_icon' => 'dashicons-heart',
		'rewrite' => array("slug" => "case-studies"), // Permalinks format
		'supports' => array('title','thumbnail','revisions')
  ); 
  register_post_type('casestudies',$args);
}



