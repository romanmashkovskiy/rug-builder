<?php
/**
 * Template Name: Contact
 *
 * The contact page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[contact-select]' );

echo do_shortcode( '[contact-form]' );

echo do_shortcode( '[page-image]' );

echo do_shortcode( '[newsletter-signup]' );

get_footer();