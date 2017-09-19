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

<script> console.log('V3'); </script>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.js"></script>

	<title>Crucial Trading - Hospitality Builder</title>
</head>

<body>
	<?php

		$domain = $_SERVER['SERVER_NAME'];
		$rh_path = '/wp-content/themes/crucial-trading/rugbuilder-hospitality';
		$loader_script_url = '';
		$css_url = '';

		/* dev */
		if ($domain === 'localhost') {
			error_log('DEV');
			$loader_script_url = site_url() . $rh_path . '/dist/';
		}

		/* production */
		else {
			$loader_script_url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/dist/';
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
