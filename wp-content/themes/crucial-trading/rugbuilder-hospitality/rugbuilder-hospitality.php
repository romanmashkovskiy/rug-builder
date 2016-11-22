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
	<style>body{margin:0}</style>
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/rugbuilder-hospitality/assets/css/dist/style.min.css">
</head>
<body>
<!--
	<div id="full-loading">
		<h1>Loading</h1>
		<div class="loader"></div>
	</div>
-->	<div id="progress-menu"></div>
	<div id="drawer"></div>
	<div id="img-container">
		<div id="color-0"></div>
		<div id="color-1"></div>
		<div id="color-2"></div>
		<div id="color-3"></div>
		<div id="color-4"></div>
		<div id="color-5"></div>
		<div id="color-6"></div>
		<div id="color-7"></div>
		<div id="color-8"></div>
		<div id="color-9"></div>
	</div>
	<div id="little-loader">
		<div class="loader-container">
			<div class="loader"></div>
		</div>
	</div>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder-hospitality/vendor/PubSub/pubsub.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder-hospitality/vendor/react/react.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder-hospitality/vendor/react/react-dom.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder-hospitality/assets/js/dist/rugBuilder.min.js"></script>

	<script>
		var templateDirectoryUri = '<?php echo get_template_directory_uri(); ?>';
		var rugBuilder = new RugBuilder('website');
		rugBuilder.start();
	</script>
</body>
</html>