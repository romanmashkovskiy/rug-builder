<?php

/**
* Limit item quantity in basket - user should only be allowed one of each item in basket
*
* Contents:
* Add WooCommerce Action
*
* @package Crucial Trading
* @since Crucial Trading 1.0
*/

// Add WooCommerce Action

add_action( 'woocommerce_add_to_cart', 'limit_basket' );

function limit_basket() {

	$cart_contents = WC()->cart->get_cart();
	$keys          = array_keys ( $cart_contents );

	foreach ( $keys as $key ) {
		WC()->cart->set_quantity ( $key, 1, true );
	}
}