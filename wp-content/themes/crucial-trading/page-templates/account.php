<?php
/**
 * Template Name: Account
 *
 * The account page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

if ( is_user_logged_in() ) {

	$user    = wp_get_current_user();
	$roles   = $user->roles;

	foreach ( $roles as $role ) {
		if ( $role == 'hospitality' ) {
			header( 'Location: ' . site_url() . '/hospitality-builder' );
			break;
		}
	}
}

get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[woocommerce_my_account]' );

get_footer();