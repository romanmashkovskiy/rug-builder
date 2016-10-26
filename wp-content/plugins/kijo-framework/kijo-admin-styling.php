<?php

/** 
KIJO Framework

Custom Admin Dashboard Styling 

Requires

colors.css
style-admin.css

**/

$sitename = kijo_framework_sitename();
$sitename_normal = kijo_framework_sitename_normal();

/************************************************************************************
** Custom Admin Area Stylesheet 
*************************************************************************************/


function load_custom_wp_admin_style(){
	
	global $plugins_url;
	
  wp_register_style( 'custom_wp_admin_css', ''.$plugins_url.'/assets/css/admin/style-admin.css', false, '1.0.0' );
  wp_enqueue_style( 'custom_wp_admin_css' );

}
add_action('admin_enqueue_scripts', 'load_custom_wp_admin_style');
add_action('login_head', 'load_custom_wp_admin_style');
add_action('wp_head', 'load_custom_wp_admin_style');


/************************************************************************************
** Admin area colour scheme
*************************************************************************************/

// Add new colour scheme
function additional_admin_color_schemes() {
	
	global $plugins_url;
	global $sitename;
	global $sitename_normal;
	
	wp_admin_css_color( $sitename, __( $sitename_normal ), // New colour scheme name
		$plugins_url . '/assets/css/admin/colours/colors.css', // Path to stylesheet directory - including sass file
		array( '#24b7eb', '#808f8f', '#000000', '#ffffff' ) // Colours array - displays in options
	);
	
}
add_action('admin_init', 'additional_admin_color_schemes');

// Set new colour scheme as default

add_filter( 'get_user_option_admin_color', function( $color_scheme ) {
 
	global $_wp_admin_css_colors;
 	global $sitename;
 
	if ( 'classic' == $color_scheme || 'fresh' == $color_scheme ) {
		$color_scheme = $sitename;
	}
 
	return $color_scheme;
 
}, 5 );

/************************************************************************************
** Remove Admin Area Colour Style Picker
*************************************************************************************/

//if ( !current_user_can('manage_plugins') )
remove_action( 'admin_color_scheme_picker', 'admin_color_scheme_picker' );



/************************************************************************************
** Remove admin bar
*************************************************************************************/


add_filter( 'show_admin_bar', '__return_false' );
remove_action( 'personal_options', '_admin_bar_preferences' );

function hideAdminBar() { // Remove from options page 

echo '<style type="text/css">tr.show-admin-bar { display: none; }</style>'  ;}

add_action('admin_print_scripts-profile.php', 'hideAdminBar');



?>