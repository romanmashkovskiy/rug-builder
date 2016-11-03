<?php
/**
 * Template Name: Contact
 *
 * The contact page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[contact-select]' );

echo do_shortcode( '[contact-form]' );

get_footer();