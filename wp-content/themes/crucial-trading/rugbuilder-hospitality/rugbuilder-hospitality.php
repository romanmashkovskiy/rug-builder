<?php
/**
 * Template Name: RugBuilder Hospitality
 *
 * The rugbuilder page template
 *
 * @package Crucial Trading
 * @since Crucial 1.0
 */

/* if user is not logged in redirect them */
if ( !is_user_logged_in() ) {
	header( 'Location: ' . site_url() . '/hospitality-register' );
}

/* if post request, handle */
if ( count( $_POST ) > 0 && array_key_exists( 'choices', $_POST ) && array_key_exists( 'from', $_POST ) ) {

	$email = filter_var( $_POST['from'], FILTER_SANITIZE_EMAIL );

	if ( !filter_var( $_POST['from'], FILTER_VALIDATE_EMAIL ) ) {
		die('invalid email');
	}

	$choices = json_decode(stripslashes( $_POST['choices'] ));
	$message = '';
	$user_message = 'Thanks for creating your hospitality collection. Here are the options you selected:
		<br /><br />';
	$client_message = '';

	foreach ( $choices as $key => $choice ) {
		$user_message .= "$key: $choice<br>";
		$client_message .= "$key: $choice<br>";
	}

	$client_message .= "<br><br>";
	$user_message .= "<br><br>";

	$client_message .= "Submitted by $email";

	wp_mail('crucial.consumer@crucial-trading.com', 'New Hospitality Builder Design', $client_message, 'Content-Type: text/html; charset=ISO-8859-1');
	wp_mail('emma.hopkins@crucial-trading.com', 'New Hospitality Builder Design', $client_message, 'Content-Type: text/html; charset=ISO-8859-1');
	wp_mail($email, 'New Hospitality Builder Design', $user_message, 'Content-Type: text/html; charset=ISO-8859-1');

	die('success');
}

$user    = wp_get_current_user();
$roles   = $user->roles;
$allowed = false;

foreach ( $roles as $role ) {
	if ( $role == 'administrator' || $role == 'hospitality' || $role == 'editor' ) {
		$allowed = true;
		break;
	}
}

if ( !$allowed ) {
	header( 'Location: ' . site_url() . '/hospitality-register' );
}

?>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading - Hospitality Builder</title>
</head>
<body>

	<script src="//d105txpzekqrfa.cloudfront.net/hospitality/dist/hospitality-loader.js"></script>
	<!-- <script src="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/rugbuilder-hospitality/assets/js/dist/hospitality-builder.min.j*s"> </script> -->
	<script src="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/rugbuilder-hospitality/assets/loader/hospitality-loader.js"> </script>
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
