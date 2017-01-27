<?php

/**
 * The Template for the checkout pahe
 * 
 * Overrides wp-content/plugins/woocoomerce/templates/checkout/form-checkout.php
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// If checkout registration is disabled and not logged in, the user cannot checkout
if ( ! $checkout->enable_signup && ! $checkout->enable_guest_checkout && ! is_user_logged_in() ) {
	echo apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) );
	return;
}

?>

<form name="checkout" method="post" class="checkout woocommerce-checkout box-shadow" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

	<h2>Shipping Address</h2>

	<div class="shipping">
		<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>
	</div>

	<div class="shipping">
		<?php do_action( 'woocommerce_checkout_shipping' ); ?>
	</div>

	<h2 id="order_review_heading"><?php _e( 'Your order', 'woocommerce' ); ?></h2>

	<div id="order_review" class="woocommerce-checkout-review-order">
		<?php do_action( 'woocommerce_checkout_order_review' ); ?>
	</div>

</form>