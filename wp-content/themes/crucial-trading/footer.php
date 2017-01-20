<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Crucial_Trading
 */

?> 



			<?php echo do_shortcode( '[footer]' ); ?>
<!--
			<div class="basketPopup box-shadow">
				<a href="#" id="close-basket-popup">Close</a>
				<p class="basketMessage"></p>
			</div>
-->
			<div class="basket-dropdown">
				<h2>Basket</h2>
				<span></span>
				<a href="#" class="close-basket-dropdown">Close</a>
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
								<div class="order__name" style="max-width: 80%;">
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

		
			</main>
		</div>
		<?php wp_footer(); ?>
	</body>
</html>