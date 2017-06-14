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

	for ( $o = 0; $o < count( $res ); $o++ ) {

		$material      = $res[$o];
		$material_id   = $material->term_id;
		$material_meta = get_option( "category_$material_id" );

		$material->order = array_key_exists( 'menu_order', $material_meta ) ? $material_meta['menu_order'] : 0;

	}

	function cmp( $a, $b ) {
		return $a->order - $b->order;
	}

	usort( $res, 'cmp' );

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

			$range_id = $value->term_id;
			$src_id   = get_woocommerce_term_meta( $range_id, 'thumbnail_id', true );
			$src      = wp_get_attachment_url( $src_id );

			$value->thumbnail = $src;

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
		'posts_per_page' => -1,
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

		$cats = get_the_terms( $product_id, 'product_cat' );

		$name  = $products[$s]->post_title;
		$key   = str_replace( ' ', '', $name );

		$product = new WC_Product( $product_id );
		$code    = $product->get_sku();

		$picture   = wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'thumbnail' )[0];
		$thumb     = rwmb_meta( 'rb_texture', array(), $product_id );
		$rthumb    = rwmb_meta( 'rb_texture_portrait', array(), $product_id );
		$bmap      = rwmb_meta( 'rb_bump_map', array(), $product_id );
		$nmap      = rwmb_meta( 'rb_normal_map', array(), $product_id );
		$dmap      = rwmb_meta( 'rb_displacement_map', array(), $product_id );
		$repeatx   = rwmb_meta( 'rb_repeat_x', array(), $product_id );
		$repeaty   = rwmb_meta( 'rb_repeat_y', array(), $product_id );
		$repeatx_i = rwmb_meta( 'rb_repeat_x_inner', array(), $product_id );
		$repeaty_i = rwmb_meta( 'rb_repeat_y_inner', array(), $product_id );
		$stitching = rwmb_meta( 'rb_stitching_colour', array(), $product_id );

/* This adds in the featured image is the texture is missing
		if ( count( $thumb ) == 0 ) {
			$thumb = array( 1 => array(
				'full_url' => wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'full' )[0],
				'url'      => wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'thumbnail' )[0],
			) );
		}
*/

		$arr['id']           = $product_id;
		$arr['cats']         = $cats;
		$arr['name']         = $name;
		$arr['code']         = $code;
		$arr['picture']      = $picture;
		$arr['thumb']        = $thumb;
		$arr['rthumb']       = $rthumb;
		$arr['bmap']         = $bmap;
		$arr['nmap']         = $nmap;
		$arr['dmap']         = $dmap;
		$arr['repeatx']      = $repeatx;
		$arr['repeaty']      = $repeaty;
		$arr['repeatxinner'] = $repeatx_i;
		$arr['repeatyinner'] = $repeaty_i;
		$arr['stitching']    = $stitching;

		if ( count( $thumb ) > 0 ) {

			if ( array_key_exists( $key, $res ) ) {
				$key = $key . '~2';
			}

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

function piping_data() {

	$args = array(
		'post_type'      => 'product',
		'posts_per_page' => -1,
		'tax_query'      => array(
			array(
				'taxonomy' => 'product_cat',
				'field'    => 'slug',
				'terms'    => 'piping',
			),
		),
	);

	$query = new WP_Query( $args );

	foreach ( $query->posts as $key => $post ) {

		$product_id = $post->ID;

		$picture = wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'thumbnail' )[0];
		$thumb   = rwmb_meta( 'rb_texture', array(), $product_id );
		$rthumb  = rwmb_meta( 'rb_texture_portrait', array(), $product_id );
		$bmap    = rwmb_meta( 'rb_bump_map', array(), $product_id );
		$nmap    = rwmb_meta( 'rb_normal_map', array(), $product_id );
		$dmap    = rwmb_meta( 'rb_displacement_map', array(), $product_id );
		$repeatx = rwmb_meta( 'rb_repeat_x', array(), $product_id );
		$repeaty = rwmb_meta( 'rb_repeat_y', array(), $product_id );

		$product = new WC_Product( $product_id );
		$code    = $product->get_sku();

		if ( count( $thumb ) == 0 ) {
			$thumb = array( 1 => array(
				'full_url' => wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'full' )[0],
				'url'      => wp_get_attachment_image_src( get_post_thumbnail_id( $product_id ), 'thumbnail' )[0],
			) );
		}

		$post->picture = $picture;
		$post->thumb   = $thumb;
		$post->rthumb  = $rthumb;
		$post->bmap    = $bmap;
		$post->nmap    = $nmap;
		$post->dmap    = $dmap;
		$post->repeatx = $repeatx;
		$post->repeaty = $repeaty;
		$post->code    = $code;
	}

	return $query->posts;
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

function log_error( $error_info ) {

	$error_file = get_template_directory() . '/rugbuilder/error.log';

	$error_time    = time();
	$error_code    = $error_info['code'];
	$error_agent   = $error_info['agent'];
	$error_message = $error_info['message'];

	$error_string = "RugBuilder Error: \r\n Time of Error: $error_time \r\n Error Code: $error_code \r\n User Agent: $error_agent \r\n Error Message: $error_message \r\n\r\n";

	file_put_contents( $error_file, $error_string, FILE_APPEND );

	return true;

//	return mail( 'elliot@kijo.co', 'RugBuilder Error', $error_string );

}

function add_rug_to_cart() {

	return WC()->cart->add_to_cart( $_GET['products'], 1 );

/*
	// From http://dsgnwrks.pro/snippets/woocommerce-allow-adding-multiple-products-to-the-cart-via-the-add-to-cart-query-string/ (slighty modified)

	if ( ! class_exists( 'WC_Form_Handler' ) || empty( $_GET['products'] ) ) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request', true, 400);
		exit();
	}

	remove_action( 'wp_loaded', array( 'WC_Form_Handler', 'add_to_cart_action' ), 20 );

	$product_ids = array( $_GET['products'] );
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
*/
}
