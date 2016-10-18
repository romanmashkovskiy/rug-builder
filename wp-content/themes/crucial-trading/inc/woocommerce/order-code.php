<?php

add_action( 'woocommerce_checkout_order_processed', 'create_order_code' );

function create_order_code($order_id) {

	$order         = new WC_Order( $order_id );
	$customer_id   = $order->post->post_author;
	$customer      = new WC_Customer( $customer_id );
	$customer_data = $customer->data;
	$_items        = $order->get_items();
	$items         = array_values($_items);

	$order_header = array(
		'recordTypeIdentifier'    => 'O',
		'dateOfOrder'             => date( 'dmY' ),
		'timeOfOrder'             => date( 'His' ),
		'customerOrderReference'  => $order_id,
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

		$item = $items[$i];

		$order_line = array(
			'recordTypeIdentifier' => 'L',
			'distributorCode'      => 0,
			'distributorAccNo'     => 0,
			'distributorAddrNo'    => 0,
			'orderType'            => 'S',
			'gpcCode'              => 'AAA99999999',
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