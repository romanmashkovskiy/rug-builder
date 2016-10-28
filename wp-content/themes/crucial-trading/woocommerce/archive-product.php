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

wp_head();

echo do_shortcode( '[header-material material="coir"]' );

echo do_shortcode( '[material-swatches material="coir"]' );

wp_footer();