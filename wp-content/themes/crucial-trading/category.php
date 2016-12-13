<?php
/**
*
 * For displaying article categories
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[header size="small" archive="true"]' );

echo do_shortcode( '[news-categories]' );

echo do_shortcode( '[news-posts]' );

get_footer();