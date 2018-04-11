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

$materials = ct_get_materials_categories(); 

for ( $i = 0; $i < count( $materials ); $i++ ) {
	echo do_shortcode( '[material material="' . $materials[$i]->slug . '"]' );
}

echo '</div>';

get_footer();
