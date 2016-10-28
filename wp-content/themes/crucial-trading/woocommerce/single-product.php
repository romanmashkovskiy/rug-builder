<?php

/**
 * The Template for displaying all single products
 * 
 * Overrides wp-content/plugins/woocoomerce/templates/single-prodct.php
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

// Will set this up properly but just for now will include links here

include_once(get_template_directory() . '/patterns/header/header.php');

// Stuff that is (pretty much) set up properly

/* Vendor CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/animate.min.css">';

/* Master and page CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/master.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/patterns/header/header.css">';

/* Page content */

echo do_shortcode( '[header-material material="coir"]' );
/*
echo do_shortcode( '[]' );

echo do_shortcode( '[]' );

echo do_shortcode( '[]' );

echo do_shortcode( '[]' );

echo do_shortcode( '[]' );
*/