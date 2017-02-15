<?php
/**
 * Template Name: Hsopitality Register
 *
 * The hospitality register page
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

?>

<a href="<?php echo site_url(); ?>/my-account" class="login-hosp">Already registered? Login.</a>

<?php

echo do_shortcode( '[gravityform id=4 title=false]' );

get_footer();