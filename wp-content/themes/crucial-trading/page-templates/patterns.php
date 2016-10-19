<?php

/* Template Name: Patterns */

echo '
<style>
.pattern-title {
	border-bottom: 2px solid #333;
	color: #333;
	display: inline-block;
	font-family: Sans-Serif;
	padding-bottom: 5px;
}
</style>';

$directory = get_template_directory() . '/patterns';
$scan      = array_values(array_diff(scandir($directory), array('..', '.', 'functions.php')));

for ( $i=0; $i<count($scan); $i++ ) {

	echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.css">';
	echo '<script src="' . get_template_directory_uri() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.js"></script>';
	echo '<h1 class="pattern-title">Pattern: ' . ucwords( $scan[$i] ) . '</h1>';
	include( get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.php' );
}