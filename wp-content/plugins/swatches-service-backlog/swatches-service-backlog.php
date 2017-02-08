<?php

/**
 * Plugin Name: Swatches Service Backlog
 * Description: Send the backlogged swatches via FTP
 * Author: KIJO
 * Author URI: http://kijo.co
 * Version: 1.1.0
 */

class SendBacklogFiles {

	public function run() {

		if ( is_admin() ) {
			return;
		}

		$args = array(
			'post_type'      => 'shop_order',
			'posts_per_page' => '-1',
			'post_status'    => array( 'wc-pending', 'wc-processing', 'wc-on-hold', 'wc-completed', 'wc-cancelled', 'wc-refunded', 'wc-failed' ),
		);

		$query  = new WP_Query( $args );
		$orders = $query->posts;

		$order_str = '';

		foreach ( $orders as $key => $order ) {

			$order_id = $order->ID;

			$order         = new WC_Order( $order_id );

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
				'customerAddressLine1'    => $order->shipping_address_1,
				'customerAddressLine2'    => $order->shipping_address_2,
				'customerAddressLine3'    => $order->shipping_city,
				'customerAddressLine4'    => '',
				'customerAddressLine5'    => '',
				'customerAddressLine6'    => '',
				'customerPostcode'        => $order->shipping_postcode,
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

			$order_str .= $order_header_str;
			$order_str .= $order_line_str;
		}

		$num_of_orders = substr_count( $order_str, 'O' );
		$footer_number = str_pad( $num_of_orders, 6, 0, STR_PAD_LEFT );

		$file = fopen( "CRU04.000001", 'a' );

		fwrite( $file, "H|000001" );
		fwrite( $file, "\r\n" );
		fwrite( $file, $order_str );
		fwrite( $file, "T|$footer_number" );

		fclose( $file );

		$ip_address = '';

		if ( defined( 'WP_ENV' ) && WP_ENV === 'production' && strpos( $_SERVER['HTTP_HOST'], 'beanstalk' ) === false ) {
			$ip_address = '195.102.23.61';
		} else {
			$ip_address = '89.187.86.163';
		}

		$ftp_connection = ftp_connect( $ip_address );

		$username = '';
		$password = '';

		if ( defined( 'WP_ENV' ) && WP_ENV === 'production' && strpos( $_SERVER['HTTP_HOST'], 'beanstalk' ) === false ) {
			$username = 'KJOCRU';
			$password = 'Cr0k1J0s';
		} else {
			$username = 'elliot@kijo.co';
			$password = 'K2i0j1o5!';
		}

		$ftp_login = ftp_login( $ftp_connection, $username, $password );

		ftp_pasv( $ftp_connection, true );

		$remote_file = '';

		if ( defined( 'WP_ENV' ) && WP_ENV === 'production' && strpos( $_SERVER['HTTP_HOST'], 'beanstalk' ) === false ) {
			$remote_file = "./out/CRU04.000001";
		} else {
			$remote_file = "./public_html/crucial-trading/CRU04/CRU04.000001";
		}
		
		$local_file  = "CRU04.000001";

		$ftp_put = ftp_put( $ftp_connection, $remote_file, $local_file, FTP_ASCII );

		ftp_close( $ftp_connection );
		unlink( "CRU04.000001" );

		update_option( '_crucial_swatch_backlog', "Backlog of swatches successfully sent to I.P. Address $ip_address" );
		update_option( '_crucial_swatch_backlog_', "$order_str" );


	}

}

add_action( 'wp_loaded', 'hello' );

function hello() {

	$s = new SendBacklogFiles();

	$s->run();
}