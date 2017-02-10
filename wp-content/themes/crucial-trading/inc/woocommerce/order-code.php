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

function create_order_code( $order_id ) {

	$order       = new WC_Order( $order_id );
	$_items      = $order->get_items();
	$items       = array_values($_items);
	$customer_id = $order->customer_user;

	$first_digits = (int)substr( $order_id, 0, -3 );
	$last_digits  = (int)substr( $order_id, -3 );
	$thousand     = (int)(($first_digits - 3) * 1000);

	$cor = (int)(95000 + $thousand + $last_digits);

	$first_name = get_user_meta( $customer_id, 'shipping_first_name', true );
	$last_name  = get_user_meta( $customer_id, 'shipping_last_name', true );

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
		'customerAddressLine1'    => $order->shipping_address_1,
		'customerAddressLine2'    => $order->shipping_address_2,
		'customerAddressLine3'    => $order->shipping_city,
		'customerAddressLine4'    => $order->shipping_country,
		'customerAddressLine5'    => '',
		'customerAddressLine6'    => '',
		'customerPostcode'        => $order->shipping_postcode,
		'outOfArea'               => 0,
		'consumerTitle'           => '',
		'consumerChristianName'   => $first_name,
		'consumerLastName'        => $last_name,
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

		$gpc_arr = wc_get_product_terms( $item_id, 'pa_gpc', array( 'fields' => 'names' ) );
		$gpc     = array_shift( $gpc_arr );

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

	$orders = get_option( '_crucial_ftp_orders' );

	if ( !$orders ) {
		$orders = '';
	}

	$orders .= $order_header_str;
	$orders .= $order_line_str;

	update_option( '_crucial_ftp_orders', $orders );

}
