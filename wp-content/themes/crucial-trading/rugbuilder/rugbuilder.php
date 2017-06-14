<?php
/**
 * Template Name: RugBuilder
 *
 * The rugbuilder page template
 *
 * @package Crucial
 * @since Crucial 1.0
 */

include_once('ajax-requests.php');

if ( array_key_exists( 'request', $_GET ) ) {

	$request = $_GET['request'];

	switch ( $request ) {
		case 'materials'   : $res = materials_data(); break;
		case 'collections' : $res = collections_data(); break;
		case 'swatches'    : $res = swatches_data(); break;
		case 'border'      : $res = border_data(); break;
		case 'piping'      : $res = piping_data(); break;
		case 'price'       : $res = price_data(); break;
	}

	echo json_encode( $res );
	exit();
}

if ( array_key_exists( 'products', $_GET ) ) {
	add_rug_to_cart();
	exit();
}

if ( array_key_exists( 'err', $_GET ) ) {

	$error_code = (int) $_GET['err'];

	if ( $error_code > 0 ) {

		$user_agent = array_key_exists( 'HTTP_USER_AGENT', $_SERVER ) ? $_SERVER['HTTP_USER_AGENT'] : '';
		$message    = array_key_exists( 'message', $_GET ) ? filter_var( $_GET['message'], FILTER_SANITIZE_STRING ) : '';

		$error_info = array(
			'code'    => $error_code,
			'agent'   => $user_agent,
			'message' => $message,
		);

		echo log_error( $error_info );
	}

	exit();
}

$args  = array(
	'post_type' => 'product',
	'name'      => 'bespoke-rug'
);

$query  = new WP_Query( $args );
$rug_id = 0;

if ( $query->have_posts() ) {

	$rug_post = $query->posts[0];

	if ( $rug_post->post_name == 'bespoke-rug' ) {
		$rug_id = $rug_post->ID;
	}
}

echo '';

?>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading - Rug Builder</title>
	<style>body{margin:0}</style>
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/rugbuilder/assets/css/dist/style.min.css">
	<script>var RUG_ID = "<?php echo $rug_id; ?>"</script>
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	
	  ga('create', 'UA-6149929-1', 'auto');
	  ga('send', 'pageview');
	
	</script>
</head>
<body>

	<div id="background-div"></div>
	<div id="app">
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
			<img src="http://d105txpzekqrfa.cloudfront.net/uploads/20170110133952/exit.svg" id="close-error">
		</div>
	</div>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/Modernizr/modernizr.min.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/polyfills/promises.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/PubSub/pubsub.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/react/react.min.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/react/react-dom.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/three.js/build/three.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/orbitcontrols/orbitcontrols.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/assets/js/dist/rugBuilder.min.js"></script>

	<script>

		if ( !Modernizr.promises ) {
			window.Promise = ES6Promise;
		}

		var templateDirectoryUri = '<?php echo get_template_directory_uri(); ?>';
		var siteUrl = '<?php echo site_url(); ?>';
		var rugBuilder = new RugBuilder('website');
		rugBuilder.start();
	</script>
</body>
</html>