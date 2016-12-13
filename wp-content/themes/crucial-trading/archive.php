<?php
/**
 * The template for displaying archive pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Crucial_Trading
 */

get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[header size="small" archive="true"]' );

echo do_shortcode( '[news-categories]' );

echo do_shortcode( '[news-posts]' );

get_footer();