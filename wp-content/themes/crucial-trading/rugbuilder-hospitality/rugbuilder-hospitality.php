<?php
/**
 * Template Name: RugBuilder Hospitality
 *
 * The rugbuilder page template
 *
 * @package Crucial Trading
 * @since Crucial 1.0
 */

 if ( ! is_user_logged_in() && ! current_user_can( 'administrator' ) && ! current_user_can( 'editor' ) && ! current_user_can( 'hospitality' ) ) {
 	//header( 'Location: ' . site_url() . '/hospitality-register' );
	wp_redirect( ''.site_url().'/hospitality-register' );
 }

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading - Hospitality Builder</title>
</head>
<body>
	<div id="root"> </div>
	<?
		$domain = $_SERVER['SERVER_NAME'];
		$rh_path = '/wp-content/themes/crucial-trading/rugbuilder-hospitality';
		$loader_script_url = '';
		$css_url = '';

		/* DEV */
		if (
			$domain === 'localhost' ||
			$domain === 'vps.89hosting.co.uk'
		) {
			$loader_script_url = site_url() . $rh_path . '/dist/';
		}

		/* PRODUCTION & WIDGET */
		else {
			$loader_script_url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/v2/dist/';
		}
	?>

	<script src="<?php echo $loader_script_url ?>hospitality-loader.js"></script>
	<script>

		load({
			key               : 'E9(]8x~QGIZR^-f',
			secret            : 's+yflX{Nhev3iCeg@>wgPco5}2CMS6',
			showSubmitButton  : true,
			showRestartButton : true,
			showExitButton    : true
		})

	</script>
</body>
</html>
