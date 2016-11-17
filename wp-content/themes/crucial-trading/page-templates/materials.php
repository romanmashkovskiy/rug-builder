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

echo '<div class="materials-container box-shadow">';

echo do_shortcode( '[material material="seagrass"]' );

echo do_shortcode( '[material material="coir"]' );

echo do_shortcode( '[material material="sisal"]' );

echo do_shortcode( '[material material="jute"]' );

echo do_shortcode( '[material material="wool"]' );

echo do_shortcode( '[material material="sisool"]' );

echo '</div>';

get_footer();