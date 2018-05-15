<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Moove_Functions File Doc Comment
 *
 * @category Moove_Functions
 * @package   moove-gdpr-tracking
 * @author    Gaspar Nemes
 */

function moove_gdpr_get_plugin_directory_url(){
    return plugin_dir_url( __FILE__ );
}

add_filter( 'plugin_action_links', 'moove_gdpr_plugin_settings_link', 10, 2 );

function moove_gdpr_plugin_settings_link( $links, $file ) {
    if ( $file == plugin_basename(dirname(__FILE__) . '/moove-gdpr.php') ) {
        /*
         * Insert the settings page link at the beginning
         */
        $in = '<a href="options-general.php?page=moove-gdpr">' . __('Settings','moove-gdpr') . '</a>';
        array_unshift($links, $in);

    }
    return $links;
}