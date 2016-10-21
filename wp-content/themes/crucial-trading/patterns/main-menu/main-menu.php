<?php
/**
 * Template Name: Main Menu
 * Sliding drawer menu which slides out from the right
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function crucial_main_menu() {

	$html = '';

	$html .= '<div class="menu-wrap">';
	$html .= '<nav class="menu">';
	$html .= '<div class="icon-list">';
	
	$html .= '<a href="#"><i class="fa fa-fw fa-star-o"></i><span>Favorites</span></a>
						<a href="#"><i class="fa fa-fw fa-bell-o"></i><span>Alerts</span></a>
						<a href="#"><i class="fa fa-fw fa-envelope-o"></i><span>Messages</span></a>
						<a href="#"><i class="fa fa-fw fa-comment-o"></i><span>Comments</span></a>
						<a href="#"><i class="fa fa-fw fa-bar-chart-o"></i><span>Analytics</span></a>
						<a href="#"><i class="fa fa-fw fa-newspaper-o"></i><span>Reading List</span></a>';
	
	$html .= '</div>';
	$html .= '</nav>';
	$html .= '<button class="close-button" id="close-button">Close Menu</button>';
	$html .= '</div>';
	$html .= '<button class="menu-button" id="open-button">Open Menu</button>';

	return $html;
}

add_shortcode( 'main-menu', 'crucial_main_menu' );

echo do_shortcode( '[main-menu]' );