<?php
/**
 * Template Name: RugBuilder Hospitality
 *
 * The rugbuilder page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

?>

<?php

if ( !is_user_logged_in() ) {
	echo '<script>window.location = "' . wp_login_url( get_permalink() ) . '"</script>';
}

?>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading Hospitality RugBuilder</title>
</head>
<body>

	<script src="http://d105txpzekqrfa.cloudfront.net/hospitality/dist/hospitality-loader.min.js"></script>
	<script>

	load({
		key               : 'E9(]8x~QGIZR^-f', 
		secret            : 's+yflX{Nhev3iCeg@>wgPco5}2CMS6',
		showSubmitButton  : false,
		showRestartButton : true,
		showExitButton    : true
	})

	</script>

</body>
</html>