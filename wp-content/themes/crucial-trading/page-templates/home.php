<?php
/**
 * Template Name: Home
 *
 * The home page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[super-slider]' );

echo do_shortcode( '[section-boxes number=0]' );

echo do_shortcode( '[materials-slider]' );

echo do_shortcode( '[section-boxes number=1]' );

echo do_shortcode( '[brochure-cta]' );

echo do_shortcode( '[home-inspiration-widget]' );

get_footer();