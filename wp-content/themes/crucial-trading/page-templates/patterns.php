<?php

/* Template Name: Patterns */

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css">';
echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/vendor/animate.min.css">';

echo '<script src="http://localhost:8888/crucial-trading/wp-includes/js/jquery/jquery.js?ver=1.12.4"></script>';
echo '<script src="' . get_template_directory_uri() . '/assets/js/vendor/super-slider.min.js"></script>';

echo '
<style>
.pattern-title {
	border-bottom: 2px solid #333 !important;
	color: #333 !important;
	display: inline-block !important;
	font-family: Sans-Serif !important;
	font-size: 20px !important;
	padding-bottom: 5px !important;
}
h6 {
	background: #ddd !important;
	color: #333 !important;
	font-family: Sans-Serif !important;
	font-size: 18px !important;
	margin: 0 !important;
	padding: 6px !important;
}
</style>';

echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/assets/css/dist/master.min.css">';

$directory = get_template_directory() . '/patterns';
$scan      = array_values(array_diff(scandir($directory), array('..', '.', 'functions.php')));

for ( $i=0; $i<count($scan); $i++ ) {

	echo '<h1 class="pattern-title">Pattern: ' . ucwords( $scan[$i] ) . '</h1>';

	if ( file_exists( get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.css' ) ) {
		echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.css">';
	}

	if ( file_exists( get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.js' ) ) {
		echo '<script src="' . get_template_directory_uri() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.js"></script>';
	}
	
	include( get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.php' );
}

?>