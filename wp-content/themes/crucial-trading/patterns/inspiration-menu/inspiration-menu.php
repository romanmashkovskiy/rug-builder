<?php

/**
 * Template Name: Inspiration Menu
 * The menu for the inspiration page
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function inspiration_menu() {

	$html = '';

	$html .= '<div class="inspiration-menu">';
	$html .= '<ul class="insp-menu__list">';

	$html .= '<li class="insp-menu__item">';
	$html .= '<a href="#" class="insp-menu__link" data-content="social">';
	$html .= '<h3 class="insp-menu__title">Social</h3>';
	$html .= '</a>';
	$html .= '</li>';

	$html .= '<li class="insp-menu__item">';
	$html .= '<a href="#" class="insp-menu__link" data-content="room-shots">';
	$html .= '<h3 class="insp-menu__title">Room Shots</h3>';
	$html .= '</a>';
	$html .= '</li>';

	$html .= '<li class="insp-menu__item">';
	$html .= '<a href="#" class="insp-menu__link" data-content="videos">';
	$html .= '<h3 class="insp-menu__title">Videos</h3>';
	$html .= '</a>';
	$html .= '</li>';

	$html .= '</ul>';
	$html .= '</div>';

	return $html;

}

add_shortcode( 'inspiration-menu', 'inspiration_menu' );