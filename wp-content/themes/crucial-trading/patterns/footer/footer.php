<?php
/**
 * Template Name: Footer
 * Main Website Footer
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
	$crucial_social_link_insta = 'https://www.instagram.com/crucialtrading';
	$crucial_social_link_twitter = 'https://twitter.com/CrucialTrading';
	$crucial_social_link_tumblr = 'https://tumblr.com';

	// Start building HTML output
	$html = '';

	$html .= '<footer>
		<div class="footer__line"></div>
		<div class="footer-columns clearfix">
		<div class="footer__col footer__col--social col-sm-6 col-md-4">
			<ul>
				<li><a href="'.$crucial_social_link_twitter.'" title="Twitter" target="_blank">twitter <i class="icon-crucial-twitter"></i></a></li>
				<li><a href="'.$crucial_social_link_insta.'" title="Instagram" target="_blank">instagram <i class="icon-crucial-instagram"></i></a></li>
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
			<div class="footer__info__contact-details">
				<span class="footer__info--phone">01562 743 747</span>
				<span class="footer__info--address">Gorsey Lane, Coleshill, Birmingham, B46 1JU</span>
				<span class="footer__info--privacy"><a href="'.site_url().'/privacy-policy">Privacy Policy</a></span>
				<span class="footer__info--copyright">&copy; '.date("Y").' Crucial Trading Ltd </span>
			</div>
			<div class="footer__info__design">
				<span class="footer__info--design-agency"><a href="https://kijo.co" title="Web Design by KIJO" target="_blank" rel="noopener">Web Design</a> by <a href="https://kijo.co" title="Creative Web Design by KIJO" target="_blank" rel="noopener">KIJO</a></span>
			</div>
		</div>';
		$html .= '</footer>';

	return $html;
}

add_shortcode( 'footer', 'crucial_footer' );
