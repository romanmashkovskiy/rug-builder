<?php

/**
 * Template Name: Home Page News
 * The latest news seciton on the home page
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function home_page_news( $atts = '' ) {

	$html = '';

	$query = wp_get_recent_posts( array( 'numberposts' => 1 ) );

	if ( count( $query ) == 0 ) {
		return $html;
	}

	$post = $query[0];

	$post_id       = $post['ID'];
	$post_title    = $post['post_title'];
	$post_excerpt  = wp_trim_words( $post['post_content'], 20, '...' );
	$post_date     = get_the_date( $post_id );
	$post_perma    = get_the_permalink( $post_id );
	$post_thumb    = get_the_post_thumbnail( $post_id, 'large' );
	$post_category = get_the_category( $post_id )[0]->name;

	$html .= '<div class="latest-news">';

	$html .= '<div class="news__title">';
	$html .= '<h3>Stay up to date</h3>';
	$html .= '<h2>Latest News</h2>';
	$html .= '</div>';

	$html .= '<div class="news__post clearfix">';
	$html .= '<div class="borderr">';

	$html .= '<h3 class="cat">' . $post_category . '</h3>';
	$html .= '<span class="line"></span>';
	
	$html .= '<div class="post__left">';
	$html .= '<h2>' . $post_title . '</h2>';
	$html .= '<h3>' . $post_date . '</h3>';
	$html .= '<p>' . $post_excerpt . '</p>';
	$html .= '<a href="' . $post_perma . '">Read More</a>';
	$html .= '</div>';

	$html .= '<div class="post__right">';
	$html .= $post_thumb;
	$html .= '</div>';

	$html .= '</div>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'home-page-news', 'home_page_news' );