<?php

/**
 * The Template for displaying material pages
 * 
 * Overrides wp-content/plugins/woocoomerce/templates/archive-product.php
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

// Will set this up properly but just for now will include links here

include_once(get_template_directory() . '/patterns/header/header.php');
include_once(get_template_directory() . '/patterns/material-swatches/material-swatches.php');

// Stuff that is (pretty much) set up properly

/* Vendor CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/animate.min.css">';

/* Master and page CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/master.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/patterns/header/header.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/patterns/material-swatches/material-swatches.css">';

/* Page content */

echo do_shortcode( '[header-material material="coir"]' );

echo do_shortcode( '[material-swatches material="coir"]' );
/*
echo do_shortcode( '[]' );

echo do_shortcode( '[]' );

echo do_shortcode( '[]' );

echo do_shortcode( '[]' );
*/