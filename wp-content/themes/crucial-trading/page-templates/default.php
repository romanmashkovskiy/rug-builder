<?php
/**
 * Template Name: Default
 *
 * The default page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

get_header();

// Will set this up properly but just for now will include links here

include_once(get_template_directory() . '/patterns/header/header.php');
include_once(get_template_directory() . '/patterns/logo-nav/logo-nav.php');

echo '<script src="' . get_template_directory_uri() . '/patterns/main-menu/main-menu.js"></script>';

// Stuff that is (pretty much) set up properly

/* Vendor CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/animate.min.css">';

/* Master and page CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/master.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/pages/default.min.css">';

/* Page content */
echo do_shortcode( '[header]' );

echo do_shortcode( '[logo-nav]' );

get_footer();