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

	$html = '';

	$html .= '<div class="top-bar">';

	$html .= '<div class="top-bar__left vertical-align">';
	$html .= '<a href="'.site_url().'">';

	if ( get_page_template_slug() == 'page-templates/home.php' ) {
		$html .= '<img src="//d105txpzekqrfa.cloudfront.net/uploads/20170125174752/logo-black.svg" alt="Crucial Trading - where inspiration begins" class="full-logo">';
		$html .= '<img src="//d105txpzekqrfa.cloudfront.net/uploads/20170125174756/logo-mobile-black.svg" alt="Crucial Trading - where inspiration begins" class="mobi-logo">';
	} else {
		$html .= '<img src="//d105txpzekqrfa.cloudfront.net/uploads/2016/10/26174004/logo.svg" alt="Crucial Trading - where inspiration begins" class="full-logo">';
		$html .= '<img src="//d105txpzekqrfa.cloudfront.net/uploads/2016/10/26174002/logo-mobile.svg" alt="Crucial Trading - where inspiration begins" class="mobi-logo">';
	}

	$html .= '</a>';
	$html .= '</div>';

	$html .= do_shortcode( '[basket-button]' );

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
