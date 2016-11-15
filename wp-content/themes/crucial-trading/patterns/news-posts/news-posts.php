<?php
/**
 * Pattern: News Category Picker
 * The contact page form
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
 function news_posts( $atts = '' ) {

	wp_reset_postdata();

	$html = '';

	$categories = get_categories( array(
	    'orderby' => 'name',
	    'parent'  => 0,
	    'hide_empty' => 0
	) );
	
	$html .= '<div class="news-categories box-shadow">';
	 
		foreach ( $categories as $category ) {
		    $cat_link = get_category_link( $category->term_id );
		    $cat_name = $category->name;
		    
		    $html .= '<a href="'.$cat_link.'">'.$cat_name.'</a>';
		}

	$html .= '</div>';

	return $html;
}

add_shortcode( 'news-posts', 'news_posts' );