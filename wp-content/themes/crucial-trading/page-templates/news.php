<?php
/**
 * Template Name: News
 *
 * The news home page for displaying posts
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[news-categories]' );

echo do_shortcode( '[news-posts]' );

get_footer();