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

<script> console.log('V5'); </script>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">

	<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/cjs/react.development.js"></script> -->
	<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
	<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/react-router/4.2.0/react-router.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/4.2.2/react-router-dom.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.6/react-redux.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.js"></script>
	<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>

	<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

	<link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet">


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
		if ($domain === 'localhost' || $domain === 'vps.89hosting.co.uk') {
			$loader_script_url = site_url() . $rh_path . '/dist/';
		}

		/* PRODUCTION */
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
