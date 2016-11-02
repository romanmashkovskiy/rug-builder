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

$post_id   = $post->ID;
$post_cats = get_the_terms( $post->ID, 'product_cat' );

$material_cat      = '';
$material_cat_slug = '';
$range_cat         = '';
$range_cat_slug    = '';

foreach ( $post_cats as $key => $value ) {
	
	$parent_id = $value->parent;

	if ( $parent_id == 0 ) {
		$material_cat      = $value->name;
		$material_cat_slug = $value->slug;
	}
	else {
		$range_cat      = $value->name;
		$range_cat_slug = $value->slug;
	}
}

get_header();

echo do_shortcode( '[header-material material="' . $material_cat_slug . '" size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[material-view-slider material="' . $material_cat_slug . '" range="' . $range_cat_slug . '"]' );

echo do_shortcode( '[other-ranges material="' . $material_cat_slug . '" range="' . $range_cat_slug . '"]' );

echo do_shortcode( '[share-links material="' . $material_cat_slug . '"]' );

get_footer();