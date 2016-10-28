<?php

/**
 * The Template for displaying all single products
 * 
 * Overrides wp-content/plugins/woocoomerce/templates/single-prodct.php
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

global $post;

$post_id  = $post->ID;
$post_cat = get_the_terms( $post->ID, 'product_cat' )[0]->slug;

get_header();

echo do_shortcode( '[header-material material="' . $post_cat . '" size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[material-view-slider]' );

get_footer();