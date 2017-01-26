<?php
/**
 * Template Name: Inspiration
 *
 * The inspiration template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' ); 

echo do_shortcode( '[logo-nav]' );

//echo do_shortcode( '[share-links]' );

echo do_shortcode( '[inspiration-menu]' );

echo do_shortcode( '[inspiration-content]' );

echo do_shortcode( '[newsletter-signup]' );

get_footer();