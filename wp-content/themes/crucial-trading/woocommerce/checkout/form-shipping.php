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

	<div class="shipping-address-errors"></div>

	<div class="shipping_address">

		<?php do_action( 'woocommerce_before_checkout_shipping_form', $checkout ); ?>

		<?php foreach ( $checkout->checkout_fields['shipping'] as $key => $field ) : ?>

			<?php woocommerce_form_field( $key, $field, $checkout->get_value( $key ) ); ?>

		<?php endforeach; ?>

		<?php if ( !is_user_logged_in() ) : ?>

			<div class="create-account">

				<br>
				<p><?php _e( 'Please create an account by entering the information below. If you already have an account, please login first.', 'woocommerce' ); ?></p>

				<input id="createaccount" type="hidden" name="createaccount" value="1">

				<p class="form-row form-row form-row-wide address-field woocommerce-validated" id="billing_email_field">
					<input type="email" class="input-text " name="billing_email" id="billing_email" placeholder="Email Address">
				</p>

				<?php foreach ( $checkout->checkout_fields['account'] as $key => $field ) : ?>

					<?php woocommerce_form_field( $key, $field, $checkout->get_value( $key ) ); ?>

				<?php endforeach; ?>

				<div class="clear"></div>

			</div>
		
		<?php endif; ?>

		<input type="hidden" name="payment_method" value="cod">
		<input type="hidden" name="ship_to_different_address" value="true">

		<?php do_action( 'woocommerce_after_checkout_shipping_form', $checkout ); ?>

	</div>

	<?php do_action( 'woocommerce_before_order_notes', $checkout ); ?>

</div>
