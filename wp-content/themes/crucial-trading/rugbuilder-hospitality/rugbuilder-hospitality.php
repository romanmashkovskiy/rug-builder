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

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading Hospitality RugBuilder</title>
	<link rel="stylesheet" href="https://s3-eu-west-1.amazonaws.com/crucial-trading/hospitality/dist/hospitality-rugbuilder.min.css">
</head>
<body>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.4/pubsub.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder-hospitality/assets/loader/rugbuilder-loader.min.js"></script>
<!--
	<script src="https://s3-eu-west-1.amazonaws.com/crucial-trading/hospitality/dist/rugbuilder-loader.min.js"></script>
-->
	<script>
		new RugBuilder_Loader({
			username : 'default',
			key      : 'key',
			secret   : 'secret'
		});
	</script>

</body>
</html>