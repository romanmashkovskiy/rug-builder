<?php
/**
 * Thankyou page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/thankyou.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( $order ) : ?>

	<p class="woocommerce-thankyou-order-received">
		<?php echo apply_filters( 'woocommerce_thankyou_order_received_text', __( 'Thank you. Your request has been received.', 'woocommerce' ), $order ); ?>
	</p>

	<ul class="woocommerce-thankyou-order-details order_details">
		<li class="order">
			<?php _e( 'Request Number:', 'woocommerce' ); ?>
			<strong><?php echo $order->get_order_number(); ?></strong>
		</li>
		<li class="date">
			<?php _e( 'Date:', 'woocommerce' ); ?>
			<strong><?php echo date_i18n( get_option( 'date_format' ), strtotime( $order->order_date ) ); ?></strong>
		</li>
	</ul>

	<div class="clear"></div>

	<?php do_action( 'woocommerce_thankyou', $order->id ); ?>

<?php else : ?>

	<p class="woocommerce-thankyou-order-received">
		<?php echo apply_filters( 'woocommerce_thankyou_order_received_text', __( 'Thank you. Your request has been received.', 'woocommerce' ), null ); ?>
	</p>

<?php endif; ?>
