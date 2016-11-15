<?php

function materials_data() {

	$res = array();

	$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => 0 ) );

	foreach ( $terms as $key => $value ) {
		if ( $value->slug != 'rug-borders' ) {
			array_push( $res, $value );
		}
	}
	foreach ( $res as $key => $value ) {

		$material_id = $value->term_id;

		$thumb_id = get_woocommerce_term_meta( $material_id, 'thumbnail_id', true );
		$thumb    = wp_get_attachment_url( $thumb_id );

		$value->thumb = $thumb;
	}

	return $res;
}

function collections_data() {

	$materials    = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => 0 ) );
	$material_ids = array();

	foreach ( $materials as $key => $value ) {
		if ( $value->slug != 'rug-borders' ) {
			$material_ids[$value->term_id] = $value;
		}
	}

	$res = array();

	foreach ( $material_ids as $key => $value ) {
		$res[$value->name] = array();
	}

	$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
	
	foreach ( $terms as $key => $value ) {

		if ( $value->parent != 0 && array_key_exists( $value->parent, $material_ids ) ) {

			$parent_id = $value->parent;
			$parent    = $material_ids[$parent_id]->name;

			array_push( $res[$parent], $value );
		}
	}

	return $res;
}

function swatches_data() {

	$res = array();

	$collection = $_GET['collection'];

	$args = array(
		'post_type' => 'product',
		'tax_query' => array(
			array(
				'taxonomy' => 'product_cat',
				'field'    => 'slug',
				'terms'    => $collection,
			)
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
		$thumb = wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'thumbnail' )[0];

		$arr['name']  = $name;
		$arr['code']  = $code;
		$arr['thumb'] = $thumb;

		$res[$key] = $arr;
	}

	return $res;
}

function border_data() {

	$res = array();

	$parent_term = get_term_by( 'slug', 'rug-borders', 'product_cat' );
	$parent_id   = $parent_term->term_id;

	$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => $parent_id ) );

	foreach ( $terms as $key => $value ) {
		array_push( $res, $value );
	}
	foreach ( $res as $key => $value ) {

		$material_id = $value->term_id;

		$thumb_id = get_woocommerce_term_meta( $material_id, 'thumbnail_id', true );
		$thumb    = wp_get_attachment_url( $thumb_id );

		$value->thumb = $thumb;
	}

	return $res;
}