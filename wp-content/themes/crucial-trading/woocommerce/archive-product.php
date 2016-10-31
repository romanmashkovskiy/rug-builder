<?php

/**
 * The Template for displaying material pages
 * 
 * Overrides wp-content/plugins/woocoomerce/templates/archive-product.php
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

$category = get_queried_object();
$slug     = $category->slug;
$parent   = $category->parent;

get_header();

echo do_shortcode( '[header-material material="' . $slug . '"]' );

echo do_shortcode( '[logo-nav]' );

if ( $parent == 0 ) {
	echo do_shortcode( '[range-swatches material="' . $slug . '"]' );
} else {
//	echo do_shortcode( '[range-swatches material="' . $slug . '"]' );
}



get_footer();