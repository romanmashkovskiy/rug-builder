<?php

/* Template Name: Patterns */

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
	background: #ddd;
	color: #333;
	font-family: Sans-Serif;
	font-size: 18px;
	margin: 0;
	padding: 6px;
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