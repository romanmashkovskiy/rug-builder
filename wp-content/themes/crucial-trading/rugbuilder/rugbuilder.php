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
	}

	echo json_encode( $res );
	exit();
}

if ( array_key_exists( 'add-rug', $_GET ) && $_GET['add-rug'] == 160 ) {

	$current_number_of_rugs = 0;
	$new_rug_product_id     = str_pad( $current_number_of_rugs + 1, 10, 0, STR_PAD_LEFT );

	$post = array(
		'post_author'  => 1,
		'post_content' => '',
		'post_status'  => 'publish',
		'post_title'   => 'Custom Rug - #' . $new_rug_product_id,
		'post_parent'  => '',
		'post_type'    => 'product',
	);

	$post_id = wp_insert_post( $post );

	if ( !$post_id ) {
		header( $_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500 );
		exit();
	}

	$attr = array(
		'center-material' => $_GET['centerMaterial'],
		'border-type'     => $_GET['borderType'],
	);

	if ( $_GET['borderType'] == 'single' || $_GET['borderType'] == 'piping' ) {
		$attr['border-material'] = $_GET['borderMaterial'];
	} else if ( $_GET['borderType'] == 'double' ) {
		$attr['inner-border-material'] = $_GET['innerBorder'];
		$attr['outer-border-material'] = $_GET['outerBorder'];
	}

	update_post_meta( $post_id, '_visibility',         'visible' );
	update_post_meta( $post_id, '_stock_status',       'instock');
	update_post_meta( $post_id, '_downloadable',       'no');
	update_post_meta( $post_id, '_virtual',            'no');
	update_post_meta( $post_id, '_regular_price',      $_GET['price'] );
	update_post_meta( $post_id, '_length',             $_GET['length'] );
	update_post_meta( $post_id, '_width',              $_GET['width'] );
	update_post_meta( $post_id, '_product_attributes', $attr);
	update_post_meta( $post_id, '_price',              $_GET['price'] );

	echo $post_id;
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

	<div id="progress-menu"></div>
	<div id="drawer"></div>
	<div id="view-controls"></div>
	<div id="price"></div>
	<div id="order-screen"></div>

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