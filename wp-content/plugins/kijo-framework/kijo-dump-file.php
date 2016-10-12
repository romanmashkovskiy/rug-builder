<?php




/************************************************************************************
* Remove admin links
*************************************************************************************/

/*add_action( 'admin_menu', 'my_remove_menu_pages' );
 
function my_remove_menu_pages() {
  // If the user does not have access to publish posts
  if(!current_user_can('activate_plugins')) {
	  remove_menu_page('tools.php');
	  remove_submenu_page('themes.php', 'widgets.php');
	  remove_menu_page('link-manager.php');
	  remove_menu_page('edit.php?post_type=page');
	  remove_menu_page('options-permalink.php');
	  remove_submenu_page('options-general.php', 'options-privacy.php');
	  remove_submenu_page('options-general.php', 'options-permalink.php');
	  remove_submenu_page('options-general.php', 'options-reading.php');
	  remove_submenu_page('options-general.php', 'options-general.php');
	} 
	else if (!current_user_can('moderate_comments')) {
	remove_menu_page('edit-comments.php');
	}
}*/

/////////////////////////////////////// Get Post ID using Slug - Used in footer  ////////////////////////////////

function get_ID_by_slug($page_slug) { // Pass page slug into function
    $page = get_page_by_path($page_slug); // get_page_by_path( $page_path, $output, $post_type );
    if ($page) {
        return $page->ID; // Returns Post ID
    } else {
        return null;
    }
}

/////////////////////////////////////// Custom Fields as Title ////////////////////////////////

add_filter('title_save_pre', 'save_title');
function save_title($my_post_title) {
        if ($_POST['post_type'] == 'contacts') :
          $new_title = $_POST['dbt_text_contact_firstn'];
          $new_title2 = $_POST['dbt_text_contact_lastn'];
          $my_post_title = $new_title . ' ' . $new_title2;
        endif;
        return $my_post_title;
}

add_filter('name_save_pre', 'save_name');
function save_name($my_post_name) {
        if ($_POST['post_type'] == 'contacts') :
          $new_name = $_POST['dbt_text_contact_firstn'];
          $new_name2 = $_POST['dbt_text_contact_lastn'];
          $my_post_name = $new_name . ' ' . $new_name2;
        endif;
        return $my_post_name;
}


////////////////////////////////////////////////////////////////////////////////// Thumbnails Sizes  ///////////////////////////////////////////////////////
    if ( function_exists( 'add_theme_support' ) ) {  
        add_theme_support( 'post-thumbnails' );  
	        set_post_thumbnail_size( 250, 999, true ); // Normal post thumbnails  
					add_image_size( 'customer-quote-logo', 220, 999);
					add_image_size( 'app-3-image', 300, 999);
    }  


///////////////////////////////////////////////////////////////////////////////////////////// Remove admin links
add_action( 'admin_menu', 'my_remove_menu_pages' );
 
function my_remove_menu_pages() {
  // If the user does not have access to publish posts
  if(!current_user_can('activate_plugins')) {
	  remove_menu_page('tools.php');
	  //remove_submenu_page('themes.php', 'widgets.php');
	  remove_menu_page('link-manager.php');
	  //remove_menu_page('edit.php?post_type=page');
	  remove_menu_page('edit.php');
	  remove_menu_page('edit-comments.php');
	  remove_menu_page('options-permalink.php');
	  remove_submenu_page('options-general.php', 'options-privacy.php');
	  remove_submenu_page('options-general.php', 'options-permalink.php');
	  remove_submenu_page('options-general.php', 'options-reading.php');
	  remove_submenu_page('options-general.php', 'options-general.php');
	} 
	else if (!current_user_can('moderate_comments')) {
	remove_menu_page('edit-comments.php');
	}
}

///////////////////////////////////////////////////////////////////////////////////////////// Excerpt Length

add_filter('excerpt_length', 'my_excerpt_length');  
function my_excerpt_length($length) {  
    return 55;   
}  
add_filter('excerpt_more', 'new_excerpt_more');      
function new_excerpt_more($text){    
    return ' ';    
}  



////////////////////////////////////////////////////////////////////////////// Stop administrator account being created/deleted
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

////////////////////////////////////////////////////////////////////////////// Hide administrator account from lower level people

add_action('pre_user_query','yoursite_pre_user_query');
function yoursite_pre_user_query($user_search) {
    $user = wp_get_current_user();

    if ( $user->roles[0] != 'administrator' ) { 
        global $wpdb;

        $user_search->query_where = 
        str_replace('WHERE 1=1', 
            "WHERE 1=1 AND {$wpdb->users}.ID IN (
                 SELECT {$wpdb->usermeta}.user_id FROM $wpdb->usermeta 
                    WHERE {$wpdb->usermeta}.meta_key = '{$wpdb->prefix}user_level' 
                    AND {$wpdb->usermeta}.meta_value < 10)", 
            $user_search->query_where
        );

    }
}

////////////////////////////////////////////////////////////////////////////// Remove Account Roles

remove_role( 'subscriber' );
remove_role( 'author' );


?>














  