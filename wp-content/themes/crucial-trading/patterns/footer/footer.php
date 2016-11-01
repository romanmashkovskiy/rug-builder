<?php
/**
 * Template Name: Footer 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function crucial_footer() {
	
	// Get Menu - Main Menu Top
	$get_footer_menu_one = wp_get_nav_menu_items('main-menu-top');
	
	// Get Menu - Main Menu Bottom
	$get_menu_bottom = wp_get_nav_menu_items('main-menu-bottom');
	
	// Get social links
	$crucial_social_link_insta = 'https://instagram.com';
	$crucial_social_link_twitter = 'https://twitter.com';
	$crucial_social_link_tumblr = 'https://tumblr.com';
	
	// Start building HTML output
	$html = '';
	
	$html .= '<footer> 
		<div class="footer__col col-md-3">
				<a href="'.$crucial_social_link_twitter.'" title="Twitter" target="_blank"><i class="icon-crucial-twitter"></i>twitter</a>
				<a href="'.$crucial_social_link_insta.'" title="Instagram" target="_blank"><i class="icon-crucial-instagram"></i>instagram</a>
		</div>
		<div class="footer__col col-md-3">';
			
			if (!empty($get_menu_top)) :
				// Get Menu Top Items and Build Link 
		    foreach ( (array) $get_menu_top as $key => $menu_item ) {
		        $title = $menu_item->title;
		        $url = $menu_item->url;
		        $html .= '<a href="' . $url . '" title="'.$title.'"><span>' . $title . '</span></a>';
		    }
			endif;
			
		$html .= '</div>
		<div class="footer_col col-md-3">';

			if (!empty($get_menu_top)) :
				// Get Menu Top Items and Build Link 
		    foreach ( (array) $get_menu_top as $key => $menu_item ) {
		        $title = $menu_item->title;
		        $url = $menu_item->url;
		        $html .= '<a href="' . $url . '" title="'.$title.'"><span>' . $title . '</span></a>';
		    }
			endif;

		$html .= '</div>
	</footer>';

	return $html;
}

add_shortcode( 'footer', 'crucial_footer' );