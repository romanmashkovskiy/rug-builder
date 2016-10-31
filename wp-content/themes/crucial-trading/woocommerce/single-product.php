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
$post_cat  = '';

foreach ( $post_cats as $key => $value ) {
	
	$parent_id = $value->parent;
	$parent    = get_term( $parent_id, 'product_cat' );

	if ( $parent->slug == 'material-parent' ) {
		$post_cat = $value->name;
		break;
	}
}

get_header();

echo do_shortcode( '[header-material material="' . $post_cat . '" size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[material-view-slider]' );

echo do_shortcode( '[other-ranges]' );

get_footer();