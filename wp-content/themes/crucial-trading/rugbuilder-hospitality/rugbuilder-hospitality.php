<?php
/**
 * Template Name: RugBuilder Hospitality
 *
 * The rugbuilder page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

global $user;

if ( !is_user_logged_in() ) {
	header( 'Location: ' . site_url() );
}

$user    = wp_get_current_user();
$roles   = $user->roles;
$allowed = false;

foreach ( $roles as $role ) {
	if ( $role == 'administrator' || $role == 'hospitality' ) {
		$allowed = true;
		break;
	}
}

if ( !$allowed ) {
	header( 'Location: ' . site_url() );
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