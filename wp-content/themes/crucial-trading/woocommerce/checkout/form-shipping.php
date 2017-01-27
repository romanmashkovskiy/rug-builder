<?php

/**
 * The Template for the shipping address form
 * 
 * Overrides wp-content/plugins/woocoomerce/templates/checkout/form-shipping.php
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<div class="woocommerce-shipping-fields">

	<div class="shipping_address">

		<?php do_action( 'woocommerce_before_checkout_shipping_form', $checkout ); ?>

		<?php foreach ( $checkout->checkout_fields['shipping'] as $key => $field ) : ?>

			<?php woocommerce_form_field( $key, $field, $checkout->get_value( $key ) ); ?>

		<?php endforeach; ?>

		<input type="hidden" name="payment_method" value="cod">

		<?php do_action( 'woocommerce_after_checkout_shipping_form', $checkout ); ?>

	</div>

	<?php do_action( 'woocommerce_before_order_notes', $checkout ); ?>

</div>
