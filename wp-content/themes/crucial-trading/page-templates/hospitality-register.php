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

echo do_shortcode( '[gravityform id=4 title=false]' );

get_footer();