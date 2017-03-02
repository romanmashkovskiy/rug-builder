<?php
/**
*
 * For displaying article categories
 *
 * @package Crucial Trading
 * @since Crucial 1.0
 */

get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[header size="small" archive="true"]' );

echo do_shortcode( '[news-categories]' );

// Get Archive Category 
$category = get_the_category();

if (!empty($category)) :
	$cat_slug = $category[0]->slug; 
endif;

if ( !empty ($cat_slug)) :
	echo do_shortcode( '[news-posts category="'. $cat_slug .'"]' );
else :
	echo do_shortcode( '[news-posts]' );
endif; 

get_footer();