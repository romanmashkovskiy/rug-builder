<?php
/**
 * Template Name: Basket
 *
 * The basket page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

if ( WC()->cart->get_cart_contents_count() == 0 ) {
	header( 'Location: ' . site_url() . '/materials' );
}
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[woocommerce_cart]' );

get_footer();