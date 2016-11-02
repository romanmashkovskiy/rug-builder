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

include_once(get_template_directory() . '/patterns/main-menu/main-menu.php');

function logo_nav_shortcode( $atts = '' ) {

	$abs_style = 'style="position:absolute;"';

	if ( $atts != '' && array_key_exists( 'pattern', $atts ) && $atts['pattern'] == 'true' ) {
		$abs_style = 'style="background:#383838;"';
	}

	$html = '';

	$html .= '<div class="top-bar" ' . $abs_style . '>';

	$html .= '<div class="top-bar__left vertical-align">';
	$html .= '<a href="'.site_url().'">';
	$html .= '<img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/26174004/logo.svg" alt="Crucial Trading - where inspiration begins" class="full-logo">';
	$html .= '<img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/26174002/logo-mobile.svg" alt="Crucial Trading - where inspiration begins" class="mobi-logo">';
	$html .= '</a>';
	$html .= '</div>';

	$html .= '<div class="top-bar__right main-menu__button--wrap">
	<button class="main-menu__button menu-button" id="open-button">
		<span class="main-menu__button__icon"></span><span class="main-menu__button__text">menu</span><span class="main-menu__button__text--close">close</span>
	</button>
</div>';

	$html .= '</div>';

	$html .= do_shortcode( '[main-menu]' );

	return $html;
}

add_shortcode( 'logo-nav', 'logo_nav_shortcode' );