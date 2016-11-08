<?php
/**
 * Template Name: Basket
 *
 * The basket page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[woocommerce_cart]' );

get_footer();