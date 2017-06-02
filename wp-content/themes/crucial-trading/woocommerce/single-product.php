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

if ( $post->post_name == 'brochure' || $post->post_name == 'bespoke-rug' ) {
	header( 'Location: ' . site_url() . '/materials' );
}

$material = '';
$range    = '';

$request_uri  = $_SERVER['REQUEST_URI'];
$swatches_pos = strpos( $request_uri, 'swatches/' );
$uri_substr   = substr( $request_uri, $swatches_pos + 9 );
$material_end = strpos( $uri_substr, '/' );
$material     = substr( $uri_substr, 0, $material_end );

$material_id   = get_term_by( 'slug', $material, 'product_cat' )->term_id;
$product_terms = get_the_terms( $post->ID, 'product_cat' );

foreach ( $product_terms as $key => $term ) {

	if ( $term->parent != 0 ) {
		$range = $term->slug;
	}

	if ( $term->parent == $material_id ) {
		break;
	}

}

get_header();

echo do_shortcode( '[header-material material="' . $material . '" size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[material-view-slider material="' . $material . '" range="' . $range . '" uri="' . $uri_substr . '"]' );

echo do_shortcode( '[other-ranges material="' . $material . '"]' );

echo do_shortcode( '[newsletter-signup]' );

get_footer();
