<?php
/**
 * Template Name: Home
 *
 * The home page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
 get_header(); ?>

<?php

// Will set this up properly but just for now will include links here

include_once(get_template_directory() . '/patterns/super-slider/super-slider.php');
include_once(get_template_directory() . '/patterns/section-boxes/section-boxes.php');
include_once(get_template_directory() . '/patterns/materials-slider/materials-slider.php');

echo '<script src="' . get_template_directory_uri() . '/patterns/super-slider/super-slider.js"></script>';
echo '<script src="' . get_template_directory_uri() . '/patterns/materials-slider/materials-slider.js"></script>';

// Stuff that is (pretty much) set up properly

/* Vendor CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/animate.min.css">';

/* Master and page CSS */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/master.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/pages/home.min.css">';

/* Vendor JS */

echo '<script src="' . get_template_directory_uri() . '/assets/js/vendor/super-slider.min.js"></script>';
echo '<script src="' . get_template_directory_uri() . '/assets/js/vendor/bxslider.min.js"></script>';

/* Page content */

echo do_shortcode( '[super-slider]' );

echo do_shortcode( '[section-boxes number=0]' );

echo do_shortcode( '[materials-slider]' );

echo do_shortcode( '[section-boxes number=1]' );

?>
 
<?php get_footer(); ?>