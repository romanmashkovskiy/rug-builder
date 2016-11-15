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
	
	$news_posts = new WP_Query( array( 'post_type' => 'post' ) );
	
	$html .= '<div class="news-posts box-shadow">';
		 
		// The Loop 
		while ( $news_posts->have_posts() ) : $news_posts->the_post();
			
			$title = get_the_title();
			
			$html .= $title;
	
		endwhile;

	$html .= '</div>';

	return $html;
}

add_shortcode( 'news-posts', 'news_posts' );