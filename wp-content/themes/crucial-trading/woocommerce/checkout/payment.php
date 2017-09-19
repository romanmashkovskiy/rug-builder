<?php

/**
 * The Template for the payment button on the checkout form
 *
 * Overrides wp-content/plugins/woocoomerce/templates/checkout/payment.php
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! is_ajax() ) {
	do_action( 'woocommerce_review_order_before_payment' );
}

$order_button_text = 'Complete Checkout';

?>


<div class="form-row place-order">

	<?php wc_get_template( 'checkout/terms.php' ); ?>

	<?php do_action( 'woocommerce_review_order_before_submit' ); ?>

	<?php echo apply_filters( 'woocommerce_order_button_html', '<input type="submit" class="button alt" name="woocommerce_checkout_place_order" id="place_order" value="' . esc_attr( $order_button_text ) . '" data-value="' . esc_attr( $order_button_text ) . '" />' ); ?>

	<?php do_action( 'woocommerce_review_order_after_submit' ); ?>

	<?php wp_nonce_field( 'woocommerce-process_checkout' ); ?>
</div>

<?php
if ( ! is_ajax() ) {
	do_action( 'woocommerce_review_order_after_payment' );
}
