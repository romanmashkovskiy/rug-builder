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
	
	// Get Menu - Main Menu Top
	$get_menu_top = wp_get_nav_menu_items('main-menu-top');
	
	// Get Menu - Main Menu Bottom
	$get_menu_bottom = wp_get_nav_menu_items('main-menu-bottom');
	
	// Get social links
	$crucial_social_link_insta = 'https://instagram.com';
	$crucial_social_link_twitter = 'https://twitter.com';
	
	// Start building HTML output
	$html = '';
	
	$html .= '<div class="main-menu__button--wrap">
	<button class="main-menu__button menu-button" id="open-button">
		<span class="main-menu__button__icon"></span><span class="main-menu__button__text">menu</span><span class="main-menu__button__text--close">close</span>
	</button>
</div>';
	
	$html .= '<div class="main-menu">
	<div class="main-menu__wrap">
		<nav>
			<div class="main-menu__top icon-list">
				<div class="main-menu__top__lg">';
					
					// Get Menu Top Items and Build Link 
			    foreach ( (array) $get_menu_top as $key => $menu_item ) {
			        $title = $menu_item->title;
			        $url = $menu_item->url;
			        $html .= '<a href="' . $url . '" title="'.$title.'"><span>' . $title . '</span></a>';
			    }
				
			$html .= '</div>
				<div class="main-menu__top__sm">';

					// Get Menu Bottom Items and Build Link 
			    foreach ( (array) $get_menu_bottom as $key => $menu_item ) {
			        $title = $menu_item->title;
			        $url = $menu_item->url;
			        $html .= '<a href="' . $url . '" title="'.$title.'"><span>' . $title . '</span></a>';
			    }

			$html .=	'</div>
			</div>
			<div class="main-menu__bottom">
				<div class="main-menu__social">
					<div class="main-menu__social--twitter">
						<a href="'.$crucial_social_link_twitter.'" target="_blank"><i class="fa fa-twitter"></i>twitter</a>
					</div><div class="main-menu__social--instagram">
						<a href="'.$crucial_social_link_insta.'" target="_blank"><i class="fa fa-instagram"></i>instagram</a>
					</div>
				</div>
				<div class="main-menu__search">
					<form role="search" method="get" class="main-menu__search__form" action="/">
						<label>
						<span class="screen-reader-text"></span>
						<input type="text" class="main-menu__search__input" placeholder="Search..." value="" name="s" title="Search for:" />
						<span class="main-menu__search__icon"><i class="fa fa-search" aria-hidden="true"></i></span>
						</label>
					</form>
				</div>
			</div>
		</nav>
	</div>
</div>';

	return $html;
}

add_shortcode( 'main-menu', 'crucial_main_menu' );