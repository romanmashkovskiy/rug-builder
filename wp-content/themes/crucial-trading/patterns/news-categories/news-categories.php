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
 
 function news_category_picker( $atts = '' ) {

	wp_reset_postdata();

	$html = '';
	
	$categories = wp_list_categories( array(
    'orderby' => 'name',
    'parent'  => 0,
    'hide_empty' => true,
    'title_li' => '',
    'echo' => 0
	) );
	
	$html .= '<div class="news-categories box-shadow">';
	$html .= '<ul>';
		
	$html .= $categories;
		
	$html .= '</ul>';
	$html .= '</div>';

	return $html;
}

add_shortcode( 'news-categories', 'news_category_picker' );