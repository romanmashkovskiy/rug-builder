<?php

/**
 * Plugin Name: Swatches Service
 * Description: Send the orderded swatches via FTP
 * Author: KIJO
 * Author URI: http://kijo.co
 * Version: 1.1.0
 */

class SendFiles {

	private $AWS_KEY     = 'AKIAJSS6SMFLH73M2ZIA';

	private $AWS_SECRET  = '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';

	private $AWS_BUCKET  = 'ct-swatch-service';

	private $TABLE_NAME  = '';

	public function __construct() {

		$this->setup_options();
		$this->setup_database();

	}

	public function run() {

		$sql_time = current_time( 'mysql' );

		$orders = get_option( '_crucial_ftp_orders' );

		if ( gettype( $orders ) == 'boolean' && !$orders ) {

			$this->log( array(
				'time'  => $sql_time,
				'stage' => 'Get Orders',
				'error' => true,
				'log'   => 'Orders option not found',
			) );

			return;
		}

		if ( $orders == '' ) {

			$this->log( array(
				'time'  => $sql_time,
				'stage' => 'Get Orders',
				'error' => false,
				'log'   => 'No orders found to send',
			) );

			return;
		}

		$previous_extension = get_option( '_crucial_ftp_cru_extension' );

		if ( gettype( $previous_extension ) == 'boolean' && !$previous_extension ) {

			$this->log( array(
				'time'  => $sql_time,
				'stage' => 'Get Extension',
				'error' => true,
				'log'   => 'Extension option not found',
			) );

			return;
		}

		$previous_extension = (int)$previous_extension;

		$new_extension_int    = $previous_extension + 1;
		$new_extension_string = (string)$new_extension_int;
		$new_extension        = str_pad( $new_extension_string, 6, '0', STR_PAD_LEFT );

		$this->log( array(
			'time'  => $sql_time,
			'stage' => 'New Extension',
			'error' => false,
			'log'   => $new_extension,
		) );

		$num_of_orders = substr_count( $orders, 'O' );
		$footer_number = str_pad( $num_of_orders, 6, 0, STR_PAD_LEFT );

		$file = fopen( "CRU04.$new_extension", 'a' );

		if ( !$file ) {

			$this->log( array(
				'time'  => $sql_time,
				'stage' => 'Open File',
				'error' => true,
				'log'   => 'Error opening CRU04 file',
			) );

			return;

		}

		fwrite( $file, "H|$new_extension" );
		fwrite( $file, "\r\n" );
		fwrite( $file, $orders );
		fwrite( $file, "T|$footer_number" );

		fclose( $file );
/*
		$ip_address = '';

		if ( defined( WP_ENV ) && WP_ENV === 'production' && strpos( $_SERVER['HTTP_HOST'], 'beanstalk' ) === false ) {
			$ip_address = '195.102.23.61';
		} else {
			$ip_address = '89.187.86.163';
		}
*/
		$ip_address = '195.102.23.61';

		$this->log( array(
			'time'  => $sql_time,
			'stage' => 'FTP IP Address',
			'error' => false,
			'log'   => 'IP Address: ' . $ip_address,
		) );

		$ftp_connection = ftp_connect( $ip_address );

		if ( !$ftp_connection ) {

			$this->log( array(
				'time'  => $sql_time,
				'stage' => 'FTP Connection',
				'error' => true,
				'log'   => 'Error connecting to the FTP',
			) );

			unlink( "CRU04.$new_extension" );

			return;
		}

		$username = '';
		$password = '';

		if ( defined( WP_ENV ) && WP_ENV === 'production' && strpos( $_SERVER['HTTP_HOST'], 'beanstalk' ) === false ) {
			$username = 'KJOCRU';
			$password = 'Cr0k1J0s';
		} else {
			$username = 'elliot@kijo.co';
			$password = 'K2i0j1o5!';
		}

		$ftp_login = ftp_login( $ftp_connection, $username, $password );

		if ( !$ftp_login ) {

			$this->log( array(
				'time'  => $sql_time,
				'stage' => 'FTP Login',
				'error' => true,
				'log'   => 'Error logging in to the FTP',
			) );

			unlink( "CRU04.$new_extension" );

			return;
		}

		ftp_pasv( $ftp_connection, true );

		$remote_file = '';

		if ( defined( WP_ENV ) && WP_ENV === 'production' && strpos( $_SERVER['HTTP_HOST'], 'beanstalk' ) === false ) {
			$remote_file = "./out/CRU04.$new_extension";
		} else {
			$remote_file = "./public_html/crucial-trading/CRU04/CRU04.$new_extension";
		}
		
		$local_file  = "CRU04.$new_extension";

		$ftp_put = ftp_put( $ftp_connection, $remote_file, $local_file, FTP_ASCII );

		if ( !$ftp_put ) {

			$this->log( array(
				'time'  => $sql_time,
				'stage' => 'FTP Put',
				'error' => true,
				'log'   => 'Error uploading the file to FTP',
			) );

			unlink( "CRU04.$new_extension" );

			return;
		}

		$this->log( array(
			'time'  => $sql_time,
			'stage' => 'File Uploaded',
			'error' => false,
			'log'   => 'File uploaded via FTP',
		) );

		ftp_close( $ftp_connection );
		unlink( "CRU04.$new_extension" );

		update_option( '_crucial_ftp_orders', '' );
		update_option( '_crucial_ftp_cru_extension', $new_extension_int );

		return;

	}

	private function setup_options() {

		$orders_option_exists = get_option( '_crucial_ftp_orders' );

		if ( !$orders_option_exists ) {
			add_option( '_crucial_ftp_orders', '' );
		}

		$cru_extension_option_exists = get_option( '_crucial_ftp_cru_extension' );

		if ( !$cru_extension_option_exists ) {
			add_option( '_crucial_ftp_cru_extension', 0 );
		}

		return;

	}

	private function setup_database() {

		global $wpdb;

		$this->TABLE_NAME = $wpdb->prefix . 'swatch_service';

		if ( $wpdb->get_var( "SHOW TABLES LIKE '$this->TABLE_NAME'" ) == $this->TABLE_NAME ) {
			return;
		}

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $this->TABLE_NAME (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
			stage tinytext NOT NULL,
			error boolean NOT NULL,
			log text NOT NULL,
			PRIMARY KEY  (id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		dbDelta( $sql );

	}

	private function log( $information ) {

		global $wpdb;

		$wpdb->insert(
			$this->TABLE_NAME,
			array(
				'time'  => $information['time'],
				'stage' => $information['stage'],
				'error' => $information['error'],
				'log'   => $information['log'],
			)
		);

		return;

	}

}

register_activation_hook( __FILE__, 'activate_swatches_schedule' );

function activate_swatches_schedule() {

	$timestamp = wp_next_scheduled( 'schedule_swatches_service' );

	if( $timestamp == false ){
		wp_schedule_event( time(), 'twicedaily', 'schedule_swatches_service' );
	}
}

add_action( 'schedule_swatches_service', 'start_swatches_service' );

function start_swatches_service() {

	if ( !isset( $sf ) ) {
		$sf = new SendFiles();
	}

	$sf->run();
}

register_deactivation_hook( __FILE__, 'deactivate_swatches_schedule' );

function deactivate_swatches_schedule() {
	wp_clear_scheduled_hook( 'schedule_swatches_service' );
}