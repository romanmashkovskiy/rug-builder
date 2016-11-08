<?php

/**
 * The Template for displaying material pages
 * 
 * Overrides wp-content/plugins/woocoomerce/templates/cart/cart.php
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

<div class="basket box-shadow">
	<h2>Your Basket</h2>
	<span></span>

	<form action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
		<div class="order-line header">
			<p>Order</p>
		</div>
		<?php
		foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {

			$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
			$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

			if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {

				$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
				?>

				<div class="order-line clearfix">
					<div class="order__name">
						<?php
							if ( ! $product_permalink ) {
								echo apply_filters( 'woocommerce_cart_item_name', $_product->get_title(), $cart_item, $cart_item_key ) . '&nbsp;';
							} else {
								echo apply_filters( 'woocommerce_cart_item_name', sprintf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $_product->get_title() ), $cart_item, $cart_item_key );
							}

							// Meta data
							echo WC()->cart->get_item_data( $cart_item );

							// Backorder notification
							if ( $_product->backorders_require_notification() && $_product->is_on_backorder( $cart_item['quantity'] ) ) {
								echo '<p class="backorder_notification">' . esc_html__( 'Available on backorder', 'woocommerce' ) . '</p>';
							}
						?>
					</div>
					<div class="order__remove">
						<?php
							echo apply_filters( 'woocommerce_cart_item_remove_link', sprintf(
								'<a href="%s" class="remove" title="%s" data-product_id="%s" data-product_sku="%s">&times;</a>',
								esc_url( WC()->cart->get_remove_url( $cart_item_key ) ),
								__( 'Remove this item', 'woocommerce' ),
								esc_attr( $product_id ),
								esc_attr( $_product->get_sku() )
							), $cart_item_key );
						?>
					</div>
				</div>
				<?php
			}
		}
		do_action( 'woocommerce_cart_contents' );
		?>
	</form>

	<div class="cart-collaterals">
		<?php do_action( 'woocommerce_cart_collaterals' ); ?>
	</div>
</div>

<!--
<td class="product-thumbnail">
	<?php
		$thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );

		if ( ! $product_permalink ) {
			echo $thumbnail;
		} else {
			printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail );
		}
	?>
</td>


<td class="product-price" data-title="<?php _e( 'Price', 'woocommerce' ); ?>">
	<?php
		echo apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key );
	?>
</td>

<td class="product-quantity" data-title="<?php _e( 'Quantity', 'woocommerce' ); ?>">
	<?php
		if ( $_product->is_sold_individually() ) {
			$product_quantity = sprintf( '1 <input type="hidden" name="cart[%s][qty]" value="1" />', $cart_item_key );
		} else {
			$product_quantity = woocommerce_quantity_input( array(
				'input_name'  => "cart[{$cart_item_key}][qty]",
				'input_value' => $cart_item['quantity'],
				'max_value'   => $_product->backorders_allowed() ? '' : $_product->get_stock_quantity(),
				'min_value'   => '0'
			), $_product, false );
		}

		echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item );
	?>
</td>

<td class="product-subtotal" data-title="<?php _e( 'Total', 'woocommerce' ); ?>">
	<?php
		echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key );
	?>
</td>
-->