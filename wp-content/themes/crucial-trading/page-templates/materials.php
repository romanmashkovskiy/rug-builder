<?php
/**
 * Template Name: Materials
 *
 * The materials home template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo '<div class="materials-container">';

$args = array(
	'hide_empty' => false,
	'orderby'    => 'name',
	'parent'     => 0,
);

$materials = get_terms( 'product_cat', $args );
$materials = exclude_rug_borders( $materials );
$materials = sort_materials_menu_order( $materials );

for ( $i = 0; $i < count( $materials ); $i++ ) {
	echo do_shortcode( '[material material="' . $materials[$i]->slug . '"]' );
}

echo '</div>';

get_footer();