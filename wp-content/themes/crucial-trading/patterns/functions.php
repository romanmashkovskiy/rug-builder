<?php

function check_post_exists($title) {
	global $wpdb;

	$post_title = wp_unslash( sanitize_post_field( 'post_title', $title, 0, 'db' ) );

	$query = "SELECT ID FROM $wpdb->posts WHERE 1=1";
	$args = array();

	if ( !empty ( $title ) ) {
		$query .= ' AND post_title = %s';
		$args[] = $post_title;
	}

	if ( !empty ( $args ) )
		return (int) $wpdb->get_var( $wpdb->prepare($query, $args) );

	return 0;
}

function create_pattern_pages() {

	$directory = get_template_directory() . '/patterns';
	$scan      = array_values(array_diff(scandir($directory), array('..', '.', 'functions.php')));

	if ( !check_post_exists( 'patterns' ) ) {

		$pattern_page_arr = array(
			'post_title'  => 'patterns',
			'post_type'   => 'page',
			'post_status' => 'publish'
		);

		wp_insert_post( $pattern_page_arr );
	}

	$pattern_page_id = get_page_by_title( 'patterns' )->ID;

	for ( $i=0; $i<count($scan); $i++ ) {

		$contents = file_get_contents( get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.php' );
		$title    = 'Pattern: ' . ucwords( $scan[$i] );

		if ( !check_post_exists( $title ) ) {

			$pagearr = array(
				'post_title'   => $title,
				'post_content' => $contents,
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_parent'  => $pattern_page_id
			);

			wp_insert_post( $pagearr );
		}
	}
}

function update_pattern_page( $page = '' ) {

	$pattern_page_id = get_page_by_title( 'patterns' )->ID;

	if ( $page != '' ) {
		
		$page_id = get_page_by_title( $page )->ID;
		wp_delete_post( $page_id, true );

		$contents = file_get_contents( get_template_directory() . '/patterns/' . $page . '/' . $page . '.php' );

		$pagearr = array(
			'post_title'   => 'Pattern: ' . ucwords( $page ),
			'post_content' => $contents,
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_parent'  => $pattern_page_id
		);

		wp_insert_post( $pagearr );
	}
	else {
		
		$directory = get_template_directory() . '/patterns';
		$scan      = array_values(array_diff(scandir($directory), array('..', '.', 'functions.php')));

		for ( $i=0; $i<count($scan); $i++ ) {

			$page_id = get_page_by_title( $scan[$i] )->ID;
			wp_delete_post( $page_id, true );

			$contents = file_get_contents( get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.php' );

			$pagearr = array(
				'post_title'   => 'Pattern: ' . ucwords( $scan[$i] ),
				'post_content' => $contents,
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_parent'  => $pattern_page_id
			);

			wp_insert_post( $pagearr );
		}
	}
}