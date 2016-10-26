<?php

/**
 * Template for WooCommerce single products, overridding wp-content/plugins/woocommerce/templates/single-product.php 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/animate.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/master.min.css">';

include_once(get_template_directory() . '/patterns/material-view/material-view.php');
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/patterns/material-view/material-view.css"></script>';

while ( have_posts() ) : the_post();

$post_id       = get_the_ID();
$post_terms    = get_the_terms( $post_id, 'product_cat' );
$post_title    = get_the_title();
$post_category = $post_terms[0]->slug;

echo do_shortcode( '[material-view]' );

endwhile;