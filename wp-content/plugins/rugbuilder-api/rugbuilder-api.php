<?php

/**
* Plugin Name: Rugbuilder API
* Plugin URI:
* Description: Rest API for rugbuilder
* Version: 0.1
* Author: Kijo (Connor Moore)
* Author URI: http://kijo.co
* License: GPL12
*/

if (! defined('WPINC')) {
    die;
}

require plugin_dir_path(__FILE__) . 'includes/class-rugbuilder-api.php';

function run_rugbuilder_api() {
  $plugin = new RugBuilder_API();
}

add_action('init', 'run_rugbuilder_api');
