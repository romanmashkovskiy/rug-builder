<?php
/**
 * Template Name: RugBuilder Hospitality
 *
 * The rugbuilder page template
 *
 * @package Crucial Trading
 * @since Crucial 1.0
 */

?>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.4/pubsub.min.js"></script>

	<title>Crucial Trading - Hospitality Builder</title>
</head>
<body>


	<script src="https://cdnjs.cloudflare.com/ajax/libs/native-promise-only/0.8.1/npo.js"></script>
	<script>window.Promise = Promise</script>

	<?php
		$current_dir = dirname(__FILE__);
		$rh_path = '/wp-content/themes/crucial-trading/rugbuilder-hospitality';
	?>


	<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script> -->

	<script src="<?php echo site_url() . $rh_path; ?>/assets/loader/hospitality-loader.js"> </script>

	<?php
		/* use either local JS and CSS or S3 depending on environment */
		$domain = $_SERVER['SERVER_NAME'];
		$loader_script_url = '';
		$css_url = '';

		/* dev */
		if ($domain === 'localhost') {
			$loader_script_url = site_url() . $rh_path . '/assets/js/dist/';
			$css_url = site_url() . $rh_path . '/assets/css/dist/';
		}

		/* production */
		else {
			$loader_script_url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/dist/';
			$css_url = $loader_script_url;
		}
	?>

	<script src="<?php echo $loader_script_url ?>hospitality-builder.min.js"></script>
	<link rel="stylesheet" href="<?php echo $css_url ?>hospitality-builder.min.css">

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
