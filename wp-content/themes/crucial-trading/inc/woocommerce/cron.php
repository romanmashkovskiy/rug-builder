<?php

wp_schedule_event( time(), 'hourly', 'send_file_hook' );

add_action( 'send_file_hook', 'send_file_function' );

function send_file_function() {

	$directory = get_template_directory() . '/inc/woocommerce/cru04';
	$scan      = array_values(array_diff(scandir($directory), array('..', '.')));

	$extension = '';

	if ( count($scan) == 0 ) {
		$extension = '000001';
	}
	else {
		$last      = $scan[count($scan)-1];
		$ext       = substr($last, 6);
		$extint    = (int)$ext;
		$nextext   = $extint + 1;
		$nextstr   = (string)$nextext;
		$extension = str_pad($nextstr, 6, '0', STR_PAD_LEFT);
	}

	$file = fopen( 'wp-content/themes/crucial-trading/inc/woocommerce/cru04/cru04.' . $extension , 'w' );

	fwrite( $file, 'H|' . $extension );
	fwrite( $file, "\r\n" );

	$orders = file_get_contents( get_template_directory() . '/inc/woocommerce/orders.txt' );
	fwrite( $file, $orders );

	$number = str_pad(substr_count( $orders, 'O' ), 6, 0, STR_PAD_LEFT);
	fwrite( $file, 'T|' . $number );

	fclose( $file );

	$ftp_connection = ftp_connect('195.102.23.61');
	$login_result   = ftp_login($ftp_connection, 'KJOCRU', 'Cr0k1J0s');

	$remote_file = './';
	$local_file  = get_template_directory() . '/inc/woocommerce/cru04/cru04.' . $extension;

	if (ftp_put($ftp_connection, $remote_file, $local_file, FTP_ASCII)) {
		echo "successfully uploaded $file\n";
	} else {
		echo "There was a problem while uploading $file\n";
	}

	ftp_close($conn_id);
}