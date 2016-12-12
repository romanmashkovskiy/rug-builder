<?php

/**
 * Template Name: Logo Nav
 * The logo and mav that appear across the top of the site
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function home_inspiration_widget( $atts = '' ) {

	$html = '';

	$html .= '<div class="home-inspiration-widget clearfix">';

//	$html .= do_shortcode( '[social-post image="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24200959/organic-slide.jpg" title="Our new floor is so beautiful!" time="4 Days Ago"]' );

	$html .= do_shortcode( '[fts_twitter twitter_name=crucialtrading tweets_count=1 show_retweets=no]' );

	$html .= '<div class="widget__text">';
	$html .= '<h3>Social Satisfaction</h3>';
	$html .= '<h2>Get Inspired</h2>';
	$html .= '<span></span>';
	$html .= '<p>See how our unique products have been used as the centre of beautiful interior design</p>';
	$html .= '<a href="' . site_url() . '/inspiration">Get Inspired</a>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'home-inspiration-widget', 'home_inspiration_widget' );