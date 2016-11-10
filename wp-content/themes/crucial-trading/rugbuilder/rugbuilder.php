<?php
/**
 * Template Name: RugBuilder
 *
 * The rugbuilder page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

if ( array_key_exists( 'request', $_GET ) ) {

	$request = $_GET['request'];
	$res     = array();

	switch ( $request ) {

		case 'materials' :

			$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );

			for ( $m = 0; $m < count( $terms ); $m++ ) {
				if ( $terms[$m]->parent == 0 ) {
					array_push( $res, $terms[$m] );
				}
			}
			for ( $m2 = 0; $m2 < count( $res ); $m2++ ) {

				$material_id = $res[$m2]->term_id;

				$thumb_id = get_woocommerce_term_meta( $material_id, 'thumbnail_id', true );
				$thumb    = wp_get_attachment_url( $thumb_id );

				$res[$m2]->thumb = $thumb;
			}

			break;

		case 'collections' :

			$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );

			$material_ids = array();
			for ( $m = 0; $m < count( $terms ); $m++ ) {
				if ( $terms[$m]->parent == 0 ) {
					$material_ids[$terms[$m]->term_id] = $terms[$m];
				}
			}
			foreach( $material_ids as $key => $value ) {
				$res[$value->name] = array();
			}
			for ( $c2 = 0; $c2 < count( $terms ); $c2++ ) {

				if ( $terms[$c2]->parent != 0 ) {

					$parent_id = $terms[$c2]->parent;
					$parent    = $material_ids[$parent_id]->name;

					array_push( $res[$parent], $terms[$c2] );
				}
			}

			break;

		case 'swatches' :

			$collection = $_GET['collection'];

			$args = array(
				'post_type' => 'product',
				'tax_query' => array(
					'taxonomy' => 'product_cat',
					'field'    => 'slug',
					'terms'    => $collection,
				),
			);

			$query    = new WP_Query( $args );
			$products = $query->posts;

			for ( $s = 0; $s < $query->post_count; $s++ ) {

				$arr = array();

				$product_id   = $products[$s]->ID;
				$product_meta = get_post_meta( $product_id, '_product_attributes', true );

				$name  = $products[$s]->post_title;
				$key   = str_replace( ' ', '', $name );
				$code  = is_array( $product_meta ) && array_key_exists( 'code', $product_meta ) ? $product_meta['code']['value'] : '';
				$thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'single-post-thumbnail' )[0];

				$arr['name']  = $name;
				$arr['code']  = $code;
				$arr['thumb'] = $thumb;

				$res[$key] = $arr;
			}
	}

	echo json_encode( $res );

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

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/PubSub/pubsub.min.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/react/react.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/react/react-dom.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/three.js/build/three.js"></script>
	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/vendor/orbitcontrols/orbitcontrols.js"></script>

	<script src="<?php echo get_template_directory_uri(); ?>/rugbuilder/assets/js/dist/rugbuilder.min.js"></script>

	<script>
		var rugBuilder = new RugBuilder('website');
		rugBuilder.start();
	</script>
</body>
</html>