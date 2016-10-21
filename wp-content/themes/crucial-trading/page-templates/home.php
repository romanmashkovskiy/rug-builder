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

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/animate.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/master.min.css">';
echo '<script src="' . get_template_directory_uri() . '/assets/js/vendor/super-slider.min.js"></script>';

include_once(get_template_directory() . '/patterns/header/header.php');
include_once(get_template_directory() . '/patterns/super-slider/super-slider.php');

echo '<link rel="stylesheet" href="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/patterns/header/header.css">';
echo '<link rel="stylesheet" href="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/patterns/super-slider/super-slider.css">';
echo '<script src="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/patterns/super-slider/super-slider.js"></script>';

echo do_shortcode( '[header]' );

echo do_shortcode( '[super-slider]' );

?>
 
 <?php get_footer(); ?>