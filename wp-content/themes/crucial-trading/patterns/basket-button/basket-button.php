<?php

/**
 * Template Name: Basket Button
 * The basket button 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function basket_button() {

	$html = '';

	$html .= '<a href="#" id="basket-link" class="link-opener">';
		
	$html .= '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22px" height="23px" viewBox="0 0 22 23" version="1.1" class="main-menu__button__basket link-opener">
	    <!-- Generator: Sketch 40.2 (33826) - http://www.bohemiancoding.com/sketch -->
	    <title>Basket-icon</title>
	    <desc>Created with Sketch.</desc>
	    <defs/>
	    <g id="symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
	        <g id="Artboard" transform="translate(-76.000000, -275.000000)" fill="#9C9C9C">
	            <g id="Basket" transform="translate(76.000000, 275.000000)">
	                <path d="M22,6.91608392 L19.1113908,23 L2.88860921,23 L0,6.91608392 L22,6.91608392 Z M20.0723922,8.72633516 L17.6899744,21.1897488 L4.31002563,21.1897488 L1.92760785,8.72633516 L20.0723922,8.72633516 Z" id="Combined-Shape"/>
	                <path d="M6.96,6.91608392 L6.96,4.40221312 C6.96,1.97093795 8.93398273,1.95130763e-15 11.3579747,1.95130763e-15 C13.786909,1.95130763e-15 15.7559494,1.97440275 15.7559494,4.40744238 L15.7559494,6.91608392 L14.3407595,6.91608392 C14.3407595,6.6434986 14.3407595,6.35622393 14.3407595,6.13372428 C14.3407595,5.52416664 14.3407595,4.43484254 14.3407595,4.43484254 C14.3407595,2.7962969 13.0053212,1.45238796 11.3579747,1.45238796 C9.71398014,1.45238796 8.37518987,2.78684906 8.37518987,4.43299026 L8.37518987,6.17653162 L8.37518987,6.91608392 L6.96,6.91608392 Z" id="Combined-Shape"/>
	            </g>
	        </g>
	    </g>
	</svg>';

	$html .= '<span id="num-items-basket" class="link-opener">' . WC()->cart->get_cart_contents_count() . '</span>';

	$html .= '</a>';

	return $html;
}

add_shortcode( 'basket-button', 'basket_button' );