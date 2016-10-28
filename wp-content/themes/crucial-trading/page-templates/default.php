<?php
/**
 * Template Name: Default
 *
 * The default page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

wp_head();

echo do_shortcode( '[header]' );

echo do_shortcode( '[logo-nav]' );

wp_footer();