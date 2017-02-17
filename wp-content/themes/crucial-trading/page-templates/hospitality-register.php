<?php
/**
 * Template Name: Hsopitality Register
 *
 * The hospitality register page
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

?>

<a href="<?php echo site_url(); ?>/my-account" class="login-hosp">Already registered for our Hospitality Builder? <br />Click here to Login.</a>

<?php

echo do_shortcode( '[gravityform id=4 title=false]' );

get_footer();