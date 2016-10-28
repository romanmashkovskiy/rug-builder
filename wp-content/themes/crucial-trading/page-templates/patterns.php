<?php

/* Template Name: Patterns */

wp_head();

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

$directory = get_template_directory() . '/patterns';
$scan      = array_values(array_diff(scandir($directory), array('..', '.', '.gitignore', 'gulpfile.js', 'package.json', 'node_modules', '.DS_Store')));
//$scan      = array_values(array_diff(scandir($directory), array('..', '.', '.gitignore', 'gulpfile.js', 'package.json', 'node_modules', '.DS_Store', 'header','logo-nav', 'material-swatches','materials-slider','section-boxes', 'super-slider', 'typography')));

for ( $i=0; $i<count($scan); $i++ ) {

	if ( ucwords( $scan[$i] ) == 'Super-slider' ) {
		echo '<h1 class="pattern-title" style="">Pattern: ' . ucwords( $scan[$i] ) . '</h1>';
	} else {
		echo '<h1 class="pattern-title">Pattern: ' . ucwords( $scan[$i] ) . '</h1>';
	}

	if ( $scan[$i] == 'header' ) {
		echo '<h6>Header Small</h6>';
		echo do_shortcode( '[header]' );
		echo '<h6>Header Large</h6>';
		echo do_shortcode( '[header size="large"]' );
		echo '<h6>Header Material</h6>';
		echo do_shortcode( '[header-material material="coir"]' );
	}
	else if ( $scan[$i] == 'logo-nav' ) {
		echo do_shortcode( '[logo-nav pattern="true"]' );
	}
	else if ( $scan[$i] == 'section-boxes' ) {
		echo do_shortcode( '[section-boxes number=0]' );
	}
	else if ( $scan[$i] == 'material-swatches' ) {
		echo do_shortcode( '[material-swatches material="coir"]' );
	}
	else {
		echo do_shortcode( '[' . $scan[$i] . ']' );
	}
}

wp_footer();