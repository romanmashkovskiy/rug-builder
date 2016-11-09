<?php
/**
 * Template Name: RugBuilder
 *
 * The rugbuilder page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
?>

<?php

$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );

$materials = array();
for ( $i = 0; $i < count( $terms ); $i++ ) {

	if ( $terms[$i]->parent == 0 ) {
		array_push( $materials, $terms[$i] );
	}
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
	<script>var WC_MATERIALS = <?php echo json_encode( $materials ); ?></script>
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
		var rugBuilder = new RugBuilder();
		rugBuilder.start();
	</script>
</body>
</html>