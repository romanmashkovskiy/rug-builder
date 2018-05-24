<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * 	Contributors: MooveAgency, gaspar.nemes
 *  Plugin Name: GDPR Cookie Compliance
 *  Plugin URI: https://wordpress.org/plugins/gdpr-cookie-compliance/
 *  Description: GDPR is an EU wide legislation that specifies how user data should be handled. This plugin has settings that can assist you with GDPR cookie compliance requirements.
 *  Version: 1.0.9
 *  Author: Moove Agency
 *  Author URI: https://www.mooveagency.com
 *  License: GPLv2
 *  Text Domain: moove-gdpr
 */

define( 'MOOVE_GDPR_VERSION', '1.0.9' );

register_activation_hook( __FILE__ , 'moove_gdpr_activate' );
register_deactivation_hook( __FILE__ , 'moove_gdpr_deactivate' );

/**
 * Functions on plugin activation, create relevant pages and defaults for settings page.
 */

function moove_gdpr_activate() {

}

/**
 * Function on plugin deactivation. It removes the pages created before.
 */
function moove_gdpr_deactivate() {
    $option_name = Moove_GDPR_Content::moove_gdpr_get_option_name();
    update_option( $option_name, array() );
}

include_once( dirname( __FILE__ ).DIRECTORY_SEPARATOR.'moove-view.php' );
include_once( dirname( __FILE__ ).DIRECTORY_SEPARATOR.'moove-content.php' );
include_once( dirname( __FILE__ ).DIRECTORY_SEPARATOR.'moove-options.php' );
include_once( dirname( __FILE__ ).DIRECTORY_SEPARATOR.'moove-controller.php' );
include_once( dirname( __FILE__ ).DIRECTORY_SEPARATOR.'moove-actions.php' );
include_once( dirname( __FILE__ ).DIRECTORY_SEPARATOR.'moove-functions.php' );

