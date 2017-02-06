<?php
/**
 * Template Name: Login
 *
 * The login template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

if ( is_user_logged_in() ) {
	header( 'Location: ' . site_url() . '/materials' );	
}

get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[header size="small"]' );

wp_login_form();

get_footer();