<?php

  $endpoints = array(

    /*
     * materials-data endpoint
     * Get's material data
     */
    'materials-data' => function () {

      $response = array();

    	$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => 0 ) );

    	foreach ( $terms as $key => $value ) {
    		if ( $value->slug != 'rug-borders' ) {
    			array_push( $response, $value );
    		}
    	}
    	foreach ( $response as $key => $value ) {

    		$material_id = $value->term_id;

    		$thumb_id = get_woocommerce_term_meta( $material_id, 'thumbnail_id', true );
    		$thumb    = wp_get_attachment_url( $thumb_id );

    		$value->thumb = $thumb;
    	}

    	for ( $o = 0; $o < count($response); $o++ ) {

    		$material      = $response[$o];
    		$material_id   = $material->term_id;
    		$material_meta = get_option( "category_$material_id" );

    		$material->order = array_key_exists( 'menu_order', $material_meta ) ? $material_meta['menu_order'] : 0;
    	}

    	function cmp( $a, $b ) {
    		return $a->order - $b->order;
    	}

    	usort($response, 'cmp');

      return $response;
    },

    /*
     * collections-data endpoint
     * Get's collection data for rugbuilder
     */
    'collections-data' => function () {
      $response = array();

      if ( !array_key_exists( 'collection', $_GET ) ) {
        $materials    = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => 0 ) );
        $material_ids = array();

        foreach ( $materials as $key => $value ) {
          if ( $value->slug != 'rug-borders' ) {
            $material_ids[$value->term_id] = $value;
          }
        }

        foreach ( $material_ids as $key => $value ) {
          $response[$value->name] = array();
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

            array_push( $response[$parent], $value );
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

          array_push( $response, $value );
        }
      }

      return $response;
    },


    /*
     * swatches-data endpoint
     * Get's data for swatches
     */
    'swatches-data' => function () {
      $response = array();

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

          if ( array_key_exists( $key, $response) ) {
            $key = $key . '~2';
          }

          $response[$key] = $arr;
        }
      }

      return $response;
    },

    /*
     * border-data Endpoint
     * Get's border data for rugbuilder
     *
     */
    'border-data' => function () {
      	$response = array();

      	$parent_term = get_term_by( 'slug', 'rug-borders', 'product_cat' );
      	$parent_id   = $parent_term->term_id;

      	$terms = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'parent' => $parent_id ) );

      	foreach ( $terms as $key => $value ) {
      		if ( $value->slug != 'piping' ) {
      			array_push( $response, $value );
      		}
      	}

      	foreach ( $response as $key => $value ) {
      		$material_id = $value->term_id;

      		$thumb_id = get_woocommerce_term_meta( $material_id, 'thumbnail_id', true );
      		$thumb    = wp_get_attachment_url( $thumb_id );

      		$value->thumb = $thumb;
      	}

      	return $response;
    },

    /*
     * piping-data Endpoint
     * Get's piping data for rug
     */
    'piping-data' => function () {
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
    },

    /*
     * price-data Endpoint
     * Gets a price for the rug based on material
     */
    'price-data' => function () {
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
    },

    /*
     * Add-rug-to-cart Endpoint
     * Adds rug order to cart
     */
    'add-rug-to-cart' => function () {
      return WC()->cart->add_to_cart( $_GET['products'], 1 );
    }
  );
