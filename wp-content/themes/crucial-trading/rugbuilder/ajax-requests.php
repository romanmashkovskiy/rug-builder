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

	$res = array();

	if ( !array_key_exists( 'collection', $_GET ) ) {

		$materials    = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => 0 ) );
		$material_ids = array();

		foreach ( $materials as $key => $value ) {
			if ( $value->slug != 'rug-borders' ) {
				$material_ids[$value->term_id] = $value;
			}
		}

		foreach ( $material_ids as $key => $value ) {
			$res[$value->name] = array();
		}

		$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
		
		foreach ( $terms as $key => $value ) {

			if ( $value->parent != 0 && array_key_exists( $value->parent, $material_ids ) ) {

				$parent_id = $value->parent;
				$parent    = $material_ids[$parent_id]->name;

				$range_id = $value->term_id;
				$src_id   = get_woocommerce_term_meta( $range_id, 'thumbnail_id', true );
				$src      = wp_get_attachment_url( $src_id );

				$value->thumbnail = $src;

				array_push( $res[$parent], $value );
			}
		}
	} else {

		$collection    = $_GET['collection'];
		$collection_wc = get_term_by( 'slug', $collection, 'product_cat' );
		$collection_id = $collection_wc->term_id;

		$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => $collection_id ) );

		foreach ( $terms as $key => $value ) {
			array_push( $res, $value );
		}
	}

	return $res;
}

function swatches_data() {

	$res = array();

	$collection = $_GET['collection'];

	$args = array(
		'post_type' => 'product',
		'posts_per_page' => 100,
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

		$thumb     = rwmb_meta( 'rb_texture', array(), $product_id );
		$bmap      = rwmb_meta( 'rb_bump_map', array(), $product_id );
		$nmap      = rwmb_meta( 'rb_normal_map', array(), $product_id );
		$dmap      = rwmb_meta( 'rb_displacement_map', array(), $product_id );
		$repeatx   = rwmb_meta( 'rb_repeat_x', array(), $product_id );
		$repeaty   = rwmb_meta( 'rb_repeat_y', array(), $product_id );
		$stitching = rwmb_meta( 'rb_stitching_colour', array(), $product_id );

		$arr['id']        = $product_id;
		$arr['name']      = $name;
		$arr['code']      = $code;
		$arr['thumb']     = $thumb;
		$arr['bmap']      = $bmap;
		$arr['nmap']      = $nmap;
		$arr['dmap']      = $dmap;
		$arr['repeatx']   = $repeatx;
		$arr['repeaty']   = $repeaty;
		$arr['stitching'] = $stitching;

		if ( count( $thumb ) > 0 ) {
			$res[$key] = $arr;
		}
	}

	return $res;
}

function border_data() {

	$res = array();

	$parent_term = get_term_by( 'slug', 'rug-borders', 'product_cat' );
	$parent_id   = $parent_term->term_id;

	$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => $parent_id ) );

	foreach ( $terms as $key => $value ) {
		if ( $value->slug != 'piping' ) {
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

function price_data() {

	$material = $_GET['material'];

	$args = array(
		'post_type' => 'product',
		'posts_per_page' => 1,
		'title' => $material
	);

	$query = new WP_Query( $args );

	if ( $query->post_count != 1 ) {
		return false;
	}

	$post_id = $query->posts[0]->ID;

	$product = wc_get_product( $post_id );
	$price   = $product->get_regular_price();

	return $price;
}

function add_rug_to_cart() {

	// From http://dsgnwrks.pro/snippets/woocommerce-allow-adding-multiple-products-to-the-cart-via-the-add-to-cart-query-string/ (slighty modified)

	if ( ! class_exists( 'WC_Form_Handler' ) || empty( $_GET['products'] ) || false === strpos( $_GET['products'], ',' ) ) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request', true, 400);
		exit();
	}

	remove_action( 'wp_loaded', array( 'WC_Form_Handler', 'add_to_cart_action' ), 20 );

	$product_ids = explode( ',', $_GET['products'] );
	$count       = count( $product_ids );
	$number      = 0;

	foreach ( $product_ids as $product_id ) {

		if ( $number++ === $count ) {
			$_GET['add-to-cart'] = $product_id;
			WC_Form_Handler::add_to_cart_action();
		}

		$product_id        = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $product_id ) );
		$was_added_to_cart = false;
		$adding_to_cart    = wc_get_product( $product_id );

		if ( !$adding_to_cart ) {
			continue;
		}

		$add_to_cart_handler = apply_filters( 'woocommerce_add_to_cart_handler', $adding_to_cart->product_type, $adding_to_cart );

		$quantity          = 1;
		$passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );

		if ( $passed_validation && false !== WC()->cart->add_to_cart( $product_id, $quantity ) ) {
			wc_add_to_cart_message( array( $product_id => $quantity ), true );
		}
	}
}

function save_cart_item_data( $cart_item_data, $product_id, $variation_id ) {

	$cart_item_data = array();

	if ( array_key_exists( 'center', $_GET ) && $_GET['center'] == $product_id ) {
		$cart_item_data['length'] = array_key_exists( 'length', $_GET ) ? $_GET['length'] : 0;
		$cart_item_data['width']  = array_key_exists( 'width', $_GET ) ? $_GET['width'] : 0;
		$cart_item_data['price']  = array_key_exists( 'price', $_GET ) ? $_GET['price'] : 0;
	}

	return $cart_item_data;
}

add_filter( 'woocommerce_add_cart_item_data', 'save_cart_item_data', 10, 3 );