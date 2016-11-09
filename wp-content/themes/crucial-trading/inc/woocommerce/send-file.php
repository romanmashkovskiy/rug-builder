<?php

/**
* Create and send the cru04 files every 24 hours
* Contents:
* Get the contents of the send log to see when the file was sent
* If the last sent was over a day (84000 seconds) ago, or the last sent log is empty (therefore it has not yet been sent)
* Get the contents of the orders.txt file (containing all the orders made since the file was last sent)
* Scan the files in the cru04 directory to work out the next incremental extension
* Write the contents of the orders.txt file in the cru04 file, surrounded by the header and trailer
* Send file via ftp
* Write result of ftp and time file sent to logs, clean orders.txt file
*
* @package Crucial Trading
* @since Crucial Trading 1.0
*/

if ( file_exists( get_template_directory() . '/inc/woocommerce/orders.txt' ) && 
	 file_exists( get_template_directory() . '/inc/woocommerce/send.log' ) ) {

	// Get the contents of the send log to see when the file was sent

	$last_sent = file_get_contents( get_template_directory() . '/inc/woocommerce/send.log' );

	// If the last sent was over a day (84000 seconds) ago, 
 	// or the last sent log is empty (therefore it has not yet been sent)

	if ( ((int)$last_sent + 86400 < time()) || strlen( $last_sent ) == 0 ) {

		// Get the contents of the orders.txt file (containing 
		// all the orders made since the file was last sent)

		$orders = file_get_contents( get_template_directory() . '/inc/woocommerce/orders.txt' );

		// If the orders file isn't empty (therefore orders have been made)

		if ( strlen( $orders ) > 0 ) {

			// Scan the files in the cru04 directory to work out the next incremental extension

			if ( !file_exists( get_template_directory() . '/inc/woocommerce/cru04' ) ) {
				mkdir( get_template_directory() . '/inc/woocommerce/cru04', 0777, true );
			}

			$directory = get_template_directory() . '/inc/woocommerce/cru04';
			$scan      = array_values(array_diff(scandir($directory), array('..', '.')));

			$extension = '';

			if ( count($scan) == 0 ) {

				// If there are no files in the cru04 directory start with 000001
				$extension = '000001';
			}
			else {

				// Get the last file from the cru04 directory
				$last      = $scan[count($scan)-1];
				// Get the extension of the last file as in int
				$ext       = substr($last, 6);
				$extint    = (int)$ext;
				// Increment to get extention as string
				$nextext   = $extint + 1;
				$nextstr   = (string)$nextext;
				// Add leading zeros
				$extension = str_pad($nextstr, 6, '0', STR_PAD_LEFT);
			}

			// Write the contents of the orders.txt file in the 
			// cru04 file, surrounded by the header and trailer
			$file = fopen( 'wp-content/themes/crucial-trading/inc/woocommerce/cru04/cru04.' . $extension , 'w' );

			// Header, the letter H followed by the extension number

			fwrite( $file, 'H|' . $extension );
			fwrite( $file, "\r\n" );

			// Orders.txt content

			fwrite( $file, $orders );

			// Trailer, the letter T followed by the number of orders 
			// (calculated by the number of instances of the letter O)

			$number = str_pad(substr_count( $orders, 'O' ), 6, 0, STR_PAD_LEFT);
			fwrite( $file, 'T|' . $number );

			fclose( $file );

			// Send file via ftp

			$ftp_connection = ftp_connect('195.102.23.61');
			$login_result   = ftp_login($ftp_connection, 'KJOCRU', 'Cr0k1J0s');

			$remote_file = './in/cru04.' . $extension;
			$local_file  = get_template_directory() . '/inc/woocommerce/cru04/cru04.' . $extension;

			$result = '';

			if ( ftp_put( $ftp_connection, $remote_file, $local_file, FTP_ASCII ) ) {
				$result = 'success';
			} else {
				$result = 'failure';
			}

			ftp_close( $ftp_connection );

			// Write result of ftp and time file sent to logs, clean orders.txt file

			file_put_contents( 'wp-content/themes/crucial-trading/inc/woocommerce/upload.log', $result, FILE_APPEND );
			file_put_contents( 'wp-content/themes/crucial-trading/inc/woocommerce/send.log', time() );
			file_put_contents( 'wp-content/themes/crucial-trading/inc/woocommerce/orders.txt', '' );
		}
	}
}

	