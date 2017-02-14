<?php
/**
 * Order details table shown in emails.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-order-details.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates/Emails
 * @version     2.5.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// do_action( 'woocommerce_email_before_order_table', $order, $sent_to_admin, $plain_text, $email ); ?>

<?php if ( ! $sent_to_admin ) : ?>
	<h2><?php printf( __( 'Order #%s', 'woocommerce' ), $order->get_order_number() ); ?></h2>
<?php else : ?>
	<h2><a class="link" href="<?php echo esc_url( admin_url( 'post.php?post=' . $order->id . '&action=edit' ) ); ?>"><?php printf( __( 'Order #%s', 'woocommerce'), $order->get_order_number() ); ?></a> (<?php printf( '<time datetime="%s">%s</time>', date_i18n( 'c', strtotime( $order->order_date ) ), date_i18n( wc_date_format(), strtotime( $order->order_date ) ) ); ?>)</h2>
<?php endif; ?>

<table class="td" cellspacing="0" cellpadding="6" style="width: 100%; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" border="1">
	<thead>
		<tr>
			<div style="width:50%;border-bottom:3px solid #bbbbbb;float:left;padding:0 10px 10px;box-sizing:border-box;">Product</div>
			<div style="width:50%;border-bottom:3px solid #bbbbbb;float:left;text-align:right;padding:0 10px 10px;box-sizing:border-box;">Quantity</div>
		</tr>
	</thead>
	<tbody>
		
		<?php

		$items = $order->get_items();

		foreach ( $items as $key => $value ) {
			?>
			<div>
			<div style="width:50%;border-bottom:1px solid #e4e4e4;float:left;padding:12px 10px;box-sizing:border-box;">
				<?php

					echo $value['name'];

					$br = 0;

					if ( $value['name'] == 'Bespoke Rug' ) {

						echo '<br>';
						
						if ( array_key_exists( 'Length', $value ) ) {
							echo '<span style="font-size:12px;margin:0;">Length: ' . $value['Length'] . '</span><br>';
							$br++;
						}

						if ( array_key_exists( 'Width', $value ) ) {
							echo '<span style="font-size:12px;margin:0;">Width: ' . $value['Width'] . '</span><br>';
							$br++;
						}

						if ( array_key_exists( 'Center Material', $value ) ) {
							echo '<span style="font-size:12px;margin:0;">Center Material: ' . $value['Center Material'] . '</span><br>';
							$br++;
						}

						if ( array_key_exists( 'Inner Border', $value ) ) {
							echo '<span style="font-size:12px;margin:0;">Inner Border: ' . $value['Inner Border'] . '</span><br>';
							$br++;
						}

						if ( array_key_exists( 'Piping', $value ) ) {
							echo '<span style="font-size:12px;margin:0;">Piping: ' . $value['Piping'] . '</span><br>';
							$br++;
						}

						if ( array_key_exists( 'Outer Border', $value ) ) {
							echo '<span style="font-size:12px;margin:0;">Outer Border: ' . $value['Outer Border'] . '</span><br>';
							$br++;
						}

						if ( array_key_exists( 'Price', $value ) ) {
							echo '<span style="font-size:12px;margin:0;">Price: ' . $value['Price'] . '</span><br>';
							$br++;
						}

						echo '<div style="height:1px;width:100%;"></div>';

					}

				?>
			</div>
			<div style="width:50%;border-bottom:1px solid #e4e4e4;float:left;text-align:right;padding:12px 10px;box-sizing:border-box;">
				<?php

					echo $value['qty'];

					for ( $i = 0; $i < $br + 1; $i++ ) {
						echo '<span style="font-size:12px;margin:0;"></span><br>';
					}

				?>
			</div>
			</div>
			<?
		}

	/*	 echo $order->email_order_items_table( array(
			'show_sku'      => $sent_to_admin,
			'show_image'    => false,
			'image_size'    => array( 32, 32 ),
			'plain_text'    => $plain_text,
			'sent_to_admin' => $sent_to_admin
		) ); */ ?>
	</tbody>
</table>

<?php do_action( 'woocommerce_email_after_order_table', $order, $sent_to_admin, $plain_text, $email ); ?>
