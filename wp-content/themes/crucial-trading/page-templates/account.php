<?php
/**
 * Template Name: Account
 *
 * The account page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[woocommerce_my_account]' );

get_footer();