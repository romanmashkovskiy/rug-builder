<?php
/**
 * Template Name: Checkout
 *
 * The checkout page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[woocommerce_checkout]' );

get_footer();