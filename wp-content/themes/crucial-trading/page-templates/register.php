<?php
/**
 * Template Name: Register
 *
 * The register page
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

if ( is_user_logged_in() ) {
	header( 'Location: ' . site_url() . '/my-account' );
}

get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[wppb-register]' );

get_footer();

?>