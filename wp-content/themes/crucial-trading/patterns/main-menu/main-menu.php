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

	$html .= '<div class="main-menu">
	<div class="main-menu__wrap">
		<nav>
			<div class="main-menu__top icon-list">
				<div class="main-menu__top__lg">
					<a href="#" class="active"><span>our products</span></a>
					<a href="#"><span>rug builder</span></a>
					<a href="#"><span>about crucial</span></a>
					<a href="#"><span>inspiration</span></a>
					<a href="#"><span>find a retailer</span></a>
				</div>
				<div class="main-menu__top__sm">
					<a href="#"><span>latest news</span></a>
					<a href="#"><span>order brochure</span></a>
					<a href="#"><span>care & maintenance</span></a>
					<a href="#"><span>my account</span></a>
					<a href="#"><span>contact us</span></a>
				</div>
			</div>
			<div class="main-menu__bottom">
				<div class="main-menu__social">
					<div class="main-menu__social--twitter">
						<a href="#" class=""><i class="fa fa-twitter"></i>twitter</a>
					</div><div class="main-menu__social--instagram">
						<a href="#" class=""><i class="fa fa-instagram"></i>instagram</a>
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