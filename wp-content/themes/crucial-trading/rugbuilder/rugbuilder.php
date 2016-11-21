<?php
/**
 * Template Name: RugBuilder
 *
 * The rugbuilder page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

include_once('ajax-requests.php');

if ( array_key_exists( 'request', $_GET ) ) {

	$request = $_GET['request'];

	switch ( $request ) {
		case 'materials'   : $res = materials_data(); break;
		case 'collections' : $res = collections_data(); break;
		case 'swatches'    : $res = swatches_data(); break;
		case 'border'      : $res = border_data(); break;
		case 'price'       : $res = price_data(); break;
	}

	echo json_encode( $res );
	exit();
}

if ( array_key_exists( 'products', $_GET ) ) {
	add_rug_to_cart();
	exit();
}

?>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading RugBuilder</title>
	<style>body{margin:0}</style>
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/rugbuilder/assets/css/dist/style.min.css">
</head>
<body>

	<div id="full-loading">
		<h1>Loading</h1>
		<div class="loader"></div>
	</div>
	<div id="progress-menu"></div>
	<div id="drawer"></div>
	<div id="view-controls"></div>
	<div id="price"></div>
	<div id="order-screen"></div>
	<div id="error-box">
		<p id="error-msg"></p>
		<p id="error-code"></p>
		<img src="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/rugbuilder/assets/icons/exit.svg" id="close-error">
	</div>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/PubSub/pubsub.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/react/react.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/react/react-dom.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/three.js/build/three.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/orbitcontrols/orbitcontrols.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/assets/js/dist/rugBuilder.min.js"></script>

	<script>
		var templateDirectoryUri = '<?php echo get_template_directory_uri(); ?>';
		var rugBuilder = new RugBuilder('website');
		rugBuilder.start();
	</script>
</body>
</html>