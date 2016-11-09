<?php

/**
* Create an order code every time an order is made
*
* Contents:
* Add WooCommerce Action
* Create Order Code
*
* @package Crucial Trading
* @since Crucial Trading 1.0
*/

// Add WooCommerce Action 

add_action( 'woocommerce_checkout_order_processed', 'create_order_code' );

// Create Order Code

function create_order_code($order_id) {

	$order         = new WC_Order( $order_id );
	$customer_id   = $order->post->post_author;
	$customer      = new WC_Customer( $customer_id );
	$customer_data = $customer->data;
	$_items        = $order->get_items();
	$items         = array_values($_items);
	$cor           = 90000 + $order_id;

	$order_header = array(
		'recordTypeIdentifier'    => 'O',
		'dateOfOrder'             => date( 'dmY' ),
		'timeOfOrder'             => date( 'His' ),
		'customerOrderReference'  => $cor,
		'retailerAddressLine1'    => '',
		'retailerAddressLine2'    => '',
		'retailerAddressLine3'    => '',
		'retailerAddressLine4'    => '',
		'retailerAddressLine5'    => '',
		'retailerAddressLine6'    => '',
		'retailerPostcode'        => '',
		'customerAddressLine1'    => $customer->shipping_address_1,
		'customerAddressLine2'    => $customer->shipping_address_2,
		'customerAddressLine3'    => '',
		'customerAddressLine4'    => '',
		'customerAddressLine5'    => '',
		'customerAddressLine6'    => '',
		'customerPostcode'        => $customer->shipping_postcode,
		'outOfArea'               => 0,
		'consumerTitle'           => '',
		'consumerChristianName'   => $order->billing_first_name,
		'consumerLastName'        => $order->billing_last_name,
		'companyName'             => 'Crucial Trading',
		'retailerID'              => 0,
		'consumerTelephone'       => $order->billing_phone,
		'consumerEmail'           => $order->billing_email,
		'consumerDeliveryMessage' => '',
		'retailerPhone'           => '',
		'retailerURL'             => 'www.crucial-trading.com',
		'retailerEmail'           => 'info@crucial-trading.com',
//		'alphaCode'               => '',
//		'supplierOrderReference'  => '',
	);

	$order_lines = array();

	for ( $i=0; $i<count($items); $i++ ) {

		$item      = $items[$i];
		$item_id   = $item['product_id'];
		$item_meta = get_post_meta( $item_id, '_product_attributes', true );

		$gpc = is_array($item_meta) && array_key_exists( 'gpc', $item_meta ) ? $item_meta['gpc']['value'] : '';

		$order_line = array(
			'recordTypeIdentifier' => 'L',
			'distributorCode'      => 0,
			'distributorAccNo'     => 0,
			'distributorAddrNo'    => 0,
			'orderType'            => 'S',
			'gpcCode'              => $gpc,
			'quantity'             => $item['qty'],
			'deliveryDate'         => '',
			'consumerCostPrice'    => 0,
			'consumerSellingPrice' => 0,
			'orderLineID'          => 10754,
			'categoryType'         => 01,
//			'supplierProductID'    => '',
		);

		array_push($order_lines, $order_line);
	}

	$order_header_str = "";
	$order_line_str   = "";

	foreach ($order_header as $key => $value) {
		$order_header_str .= $value . "|";
	}

	foreach ($order_lines as $key => $value) {
		foreach ($value as $key => $value) {
			$order_line_str .= $value . "|";
		}
		$order_line_str   .= "\r\n";
	}		

	$order_header_str .= "\r\n";

	file_put_contents( 'wp-content/themes/crucial-trading/inc/woocommerce/orders.txt', $order_header_str, FILE_APPEND );
	file_put_contents( 'wp-content/themes/crucial-trading/inc/woocommerce/orders.txt', $order_line_str, FILE_APPEND );
}
