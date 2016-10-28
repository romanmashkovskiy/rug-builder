<?php
/**
 * Template Name: Home
 *
 * The home page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
wp_head();

echo '<script src="' . get_template_directory_uri() . '/patterns/super-slider/super-slider.js"></script>';
echo '<script src="' . get_template_directory_uri() . '/patterns/materials-slider/materials-slider.js"></script>';

echo do_shortcode( '[super-slider]' );

echo do_shortcode( '[section-boxes number=0]' );

echo do_shortcode( '[materials-slider]' );

echo do_shortcode( '[section-boxes number=1]' );

wp_footer();