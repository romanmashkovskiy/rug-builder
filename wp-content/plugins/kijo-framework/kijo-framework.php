<?php 
/**
* Plugin Name: KIJO Framework
* Plugin URI: http://kijo.co
* Description: Framework for KIJO to customise Wordpress
* Version: 0.1 
* Author: KIJO
* Author URI: http://kijo.co
* License: GPL12
*/

	define( 'KIJO_PLUGIN_VERSION', '0.1.1' );
	
	define( 'KIJO_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
	
	define( 'KIJO_PLUGIN', __FILE__ );
	
	define( 'KIJO_PLUGIN_BASENAME', plugin_basename( KIJO_PLUGIN ) );
	
	define( 'KIJO_PLUGIN_NAME', trim( dirname( KIJO_PLUGIN_BASENAME ), '/' ) );
	
	define( 'KIJO_PLUGIN_DIR', untrailingslashit( dirname( KIJO_PLUGIN ) ) );
	
	
	$plugins_url = plugins_url('/kijo-framework');

/************************************************************************************
** Version Number
*************************************************************************************/

function kijo_framework_version() {

	$kijo_framework_version_number = KIJO_PLUGIN_VERSION;

	return $kijo_framework_version_number;

}

/************************************************************************************
** Site Name
*************************************************************************************/

function kijo_framework_sitename() {

	$kijo_framework_sitename = 'crucial-trading';

	return $kijo_framework_sitename;

}

/************************************************************************************
** Logo Location
*************************************************************************************/

function kijo_framework_logo() { // Normal
		
	global $plugins_url;
	
	$kijo_framework_logo_location = ''.$plugins_url.'/assets/images/crucial-logo@2x.png';
	
	return $kijo_framework_logo_location;

}

function kijo_framework_logo_retina() { // Retina
		
	global $plugins_url;
	
	$kijo_framework_logo_location_retina = ''.$plugins_url.'/assets/images/crucial-logo@2x.png';
	
	return $kijo_framework_logo_location_retina;

}

/************************************************************************************
** Load Framework Files
*************************************************************************************/

// Project Specific Functions File
include_once( KIJO_PLUGIN_PATH . 'kijo-project-specific.php'); 

// Login page styling
include_once( KIJO_PLUGIN_PATH . 'kijo-admin-login-styling.php'); 

// Dashboard Widgets
include_once( KIJO_PLUGIN_PATH . 'kijo-admin-dashboard.php'); 

// Admin Area Styling & Attaching Custom Style Sheet
include_once( KIJO_PLUGIN_PATH . 'kijo-admin-styling.php'); 

// White labelling - removing wordpress references within site
include_once( KIJO_PLUGIN_PATH . 'kijo-white-label.php'); 





// Custom Post types
//include_once( KIJO_PLUGIN_PATH . 'kijo-custom-post-types.php'); 

// Custom Meta Boxes
//include_once( KIJO_PLUGIN_PATH . 'kijo-custom-meta-boxes.php'); 


?>