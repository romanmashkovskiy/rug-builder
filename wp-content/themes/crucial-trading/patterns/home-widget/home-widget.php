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

function home_widget( $atts = '' ) {

	$html = '';

	$html .= '<div class="home-widget clearfix">';

	$html .= '<div class="widget__image">';
	$html .= '<div style="background-image:url(';
	$html .= "'http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24200959/organic-slide.jpg'";
	$html .= ')" class="box-shadow">';
	$html .= '<div class="border-box"></div>';
	$html .= '<div class="info">';
	$html .= '<h2>Our new floor is so beautiful!</h2>';
	$html .= '<h3>4 Days Ago</h3>';
	$html .= '</div>';
	$html .= '</div>';
	$html .= '</div>';

	$html .= '<div class="widget__text">';
	$html .= '<h3>Social Satisfaction</h3>';
	$html .= '<h2>Get Inspired</h2>';
	$html .= '<span></span>';
	$html .= '<p>See how our unique products have been used as the centre of beautiful interior design</p>';
	$html .= '<a href="#">Get Inspired</a>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'home-widget', 'home_widget' );