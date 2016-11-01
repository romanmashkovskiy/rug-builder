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
	$get_footer_menu_one = wp_get_nav_menu_items('footer-menu-one');
	
	// Get Menu - Main Menu Bottom
	$get_footer_menu_two = wp_get_nav_menu_items('footer-menu-two');
	
	// Get social links
	$crucial_social_link_insta = 'https://instagram.com';
	$crucial_social_link_twitter = 'https://twitter.com';
	$crucial_social_link_tumblr = 'https://tumblr.com';
	
	// Start building HTML output
	$html = '';
	
	$html .= '<footer>
		<div class="footer__line"></div>  
		<div class="footer-columns clearfix">
		<div class="footer__col footer__col--social col-sm-6 col-md-4">
			<ul>
				<li><a href="'.$crucial_social_link_twitter.'" title="Twitter" target="_blank"><i class="icon-crucial-twitter"></i>twitter</a></li>
				<li><a href="'.$crucial_social_link_insta.'" title="Instagram" target="_blank"><i class="icon-crucial-instagram"></i>instagram</a></li>
				<li><a href="'.$crucial_social_link_tumblr.'" title="Instagram" target="_blank"><i class="icon-crucial-tumblr"></i>tumblr</a></li>
			</ul>
		</div>
		<div class="footer__col footer__col--nav-1 col-sm-6 col-md-4">
			<ul>';
			
			if (!empty($get_footer_menu_one)) :
				// Get Menu Top Items and Build Link 
		    foreach ( (array) $get_footer_menu_one as $key => $menu_item ) {
		        $title = $menu_item->title;
		        $url = $menu_item->url;
		        $html .= '<li><a href="' . $url . '" title="'.$title.'"><span>' . $title . '</span></a></li>';
		    }
			endif;
			
		$html .= '</ul></div>
		<div class="footer__col footer__col--nav-2 hidden-xs hidden-sm col-md-4">
			<ul>';

			if (!empty($get_footer_menu_two)) :
				// Get Menu Top Items and Build Link 
		    foreach ( (array) $get_footer_menu_two as $key => $menu_item ) {
		        $title = $menu_item->title;
		        $url = $menu_item->url;
		        $html .= '<li><a href="' . $url . '" title="'.$title.'"><span>' . $title . '</span></a></li>';
		    }
			endif;

		$html .= '</ul></div></div>';
		$html .= '
		<div class="footer__info">
			<span class="footer__info--copyright">&copy; Crucial Trading Ltd '.date("Y").'</span>
			<span class="footer__info--design-agency"><a href="http://kijo.co" title="Designed by KIJO in Birmingham">design by KIJO</a></span>
		</div>';
		$html .= '</footer>';

	return $html;
}

add_shortcode( 'footer', 'crucial_footer' );