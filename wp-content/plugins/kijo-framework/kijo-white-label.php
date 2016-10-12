<?php
/** 
KIJO Framework
Project Specific Settings

Version 0.1
**/

/************************************************************************************
** No Core Update Alerts
*************************************************************************************/

add_action( 'plugins_loaded', 'disable_core_update_alerts' );

function disable_core_update_alerts() {
	if ( current_user_can('manage_plugins') ) {
		add_filter( 'pre_site_transient_update_core', create_function( '$a', "return null;" ) ); 
	}
}

/************************************************************************************
**  Admin Area - Custom Footer Version Number
*************************************************************************************/

function change_footer_version() {
	$wp_version = get_bloginfo('version');
	$kf_version = kijo_framework_version();
  return 'KF - '.$kf_version.' WP - '.$wp_version.'';
}
add_filter( 'update_footer', 'change_footer_version', 9999 );

function dashboard_footer () {
	return;
}
add_filter('admin_footer_text', 'dashboard_footer');


/************************************************************************************
**  Remove 'wordpress' from admin title 
*************************************************************************************/


add_filter('admin_title', 'my_admin_title', 10, 2);

function my_admin_title($admin_title, $title)
{
    return get_bloginfo('name').' - '.$title;
}


/************************************************************************************
**  Disable XML-RPC
*************************************************************************************/

add_filter('xmlrpc_enabled', '__return_false');


/************************************************************************************
**  Email From Name
*************************************************************************************/

/*if ( !class_exists('wp_mail_from') ) {
	class wp_mail_from {
		function wp_mail_from() {
			add_filter( 'wp_mail_from', array(&$this, 'fb_mail_from') );
			add_filter( 'wp_mail_from_name', array(&$this, 'fb_mail_from_name') );
		}
		// new name
		function fb_mail_from_name() {
			$name = get_bloginfo('name');
			// alternative the name of the blog
			$name = esc_attr($name);
			return $name;
		}
		// new email-adress
		function fb_mail_from() {
			$siteurl = get_bloginfo('url');
			$email = 'website@'.$siteurl.'';
			$email = is_email($email);
			return $email;
		}
	}
	$wp_mail_from = new wp_mail_from();
}*/


/************************************************************************************
**  Remove Wordpress generator from wp_head()
*************************************************************************************/

function wpbeginner_remove_version() {
return '';
}
add_filter('the_generator', 'wpbeginner_remove_version');

// Header Customizations
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');

// Remove Footer
function remove_footer_admin () {
echo '';
}
add_filter('admin_footer_text', 'remove_footer_admin');

?>