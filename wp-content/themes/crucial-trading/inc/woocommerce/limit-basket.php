<?php

/**
* Limit item quantity in basket - user should only be allowed one of each item in basket, and have no more than five swatches
*
* Contents:
* Add WooCommerce Action
*
* @package Crucial Trading
* @since Crucial Trading 1.0
*/

// Add WooCommerce Action

add_action( 'woocommerce_add_to_cart', 'limit_wc_basket', 10, 2 );

function limit_wc_basket( $cart_item_key, $product_id ) {

	$cart_contents = WC()->cart->get_cart();
	$keys          = array_keys ( $cart_contents );

	// Set Quantity of each item to 1

	foreach ( $keys as $key ) {
		WC()->cart->set_quantity( $key, 1, true );
	}

	// Limit to 5 swatches

	$num_of_swatches = 0;

	$inner_id  = false;
	$piping_id = false;
	$outer_id  = false;

	foreach ( $cart_contents as $key => $product ) {

		$product_id    = $product['product_id'];
		$product_terms = get_the_terms( $product_id, 'product_cat' );

		// Product is brochure, continue
		if ( !$product_terms ) {
			continue;
		}
		
		// Product is Rug Builder center, get the border product IDs, and continue
		if ( isset( $product['length'] ) ) {

			if ( isset( $product['inner'] ) ) {
				$inner_id = $product['inner'];
			}

			if ( isset( $product['piping'] ) ) {
				$inner_id = $product['piping'];
			}

			if ( isset( $product['outer'] ) ) {
				$inner_id = $product['outer'];
			}

			continue;
		}

		// Product is Rug Builder inner border, continue
		if ( $inner_id && $inner_id == $product_id ) {
			continue;
		}

		// Product is Rug Builder piping, continue
		if ( $piping_id && $piping_id == $product_id ) {
			continue;
		}

		// Product is Rug Builder outer border, continue
		if ( $outer_id && $outer_id == $product_id ) {
			continue;
		}

		$num_of_swatches++;

		if ( $num_of_swatches == 6 ) {
			WC()->cart->remove_cart_item( $key );
		}

	}
}