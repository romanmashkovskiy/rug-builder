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
$type     = $category->taxonomy;
$slug     = $category->slug;
$parent   = $category->parent;

get_header();

if ( $type == 'product_cat' ) {

	echo do_shortcode( '[header-material material="' . $slug . '"]' );

	echo do_shortcode( '[logo-nav]' );

	if ( $parent == 0 ) {
		echo do_shortcode( '[range-swatches material="' . $slug . '"]' );
	} else {
		echo do_shortcode( '[material-swatches range="' . $slug . '"]' );
	}
}
else if ( $type == 'product_tag' ) {

	echo do_shortcode( '[header-collection collection="' . $slug . '"]' );

	echo do_shortcode( '[logo-nav]' );

	echo do_shortcode( '[collection-swatches collection="' . $slug . '"]' );

	echo do_shortcode( '[share-links]' );
}

get_footer();