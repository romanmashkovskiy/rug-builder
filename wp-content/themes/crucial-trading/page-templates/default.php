<?php
/**
 * Template Name: Default
 *
 * The default page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

wp_head();

echo '<script src="' . get_template_directory_uri() . '/patterns/main-menu/main-menu.js"></script>';

echo do_shortcode( '[header]' );

echo do_shortcode( '[logo-nav]' );

wp_footer();