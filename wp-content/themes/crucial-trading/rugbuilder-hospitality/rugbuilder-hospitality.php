<?php
/**
 * Template Name: RugBuilder Hospitality
 *
 * The rugbuilder page template
 *
 * @package Crucial Trading
 * @since Crucial 1.0
 */

if ( !is_user_logged_in() ) {
	header( 'Location: ' . site_url() . '/hospitality-register' );
}

if ( count( $_POST ) > 0 && array_key_exists( 'choices', $_POST ) && array_key_exists( 'from', $_POST ) ) {

	$email = filter_var( $_POST['from'], FILTER_SANITIZE_EMAIL );

	if ( !filter_var( $_POST['from'], FILTER_VALIDATE_EMAIL ) ) {
		die('invalid email');
	}

	$choices = json_decode(stripslashes( $_POST['choices'] ));
	$message = '';

	foreach ( $choices as $key => $choice ) {
		$message .= "$key: $choice<br>";
	}

	$message .= "<br><br>";
	$message .= "Submitted by $email";

	wp_mail( 'crucial.consumer@crucial-trading.com', 'New Hospitality Builder Design', $message, 'Content-Type: text/html; charset=ISO-8859-1' );
	wp_mail( 'emma.hopkins@crucial-trading.com', 'New Hospitality Builder Design', $message, 'Content-Type: text/html; charset=ISO-8859-1' );

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

	<script src="http://d105txpzekqrfa.cloudfront.net/hospitality/dist/hospitality-loader.min.js"></script>
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