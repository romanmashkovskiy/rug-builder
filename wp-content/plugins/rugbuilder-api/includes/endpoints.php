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

      error_log('materials response -->');
      error_log($response);

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

      $rug_id = $_GET['products'];

      return WC()->cart->add_to_cart($rug_id, 1);
    },

    /**
     * Send email to the user and client reqarding rud details and quote
     */
    'send-rug-quote-email' => function (WP_REST_Request $request) {
      $user_details = new \stdClass;
      $user_details->title = $request['userTitle'];
      $user_details->name = $request['userName'];
      $user_details->email = $request['userEmail'];
      $user_details->address = $request['userAddress'];
      $user_details->postcode = $request['userPostcode'];
      $user_details->number = $request['userNumber'];
      $user_details->price = $request['price'];

      // $user_title = $request['userTitle'];
      // $user_name = $request['userName'];

      // $user_address = $request['userAddress'];
      //
      // $user_postcode = $request['userPostcode'];
      // $user_number = $request['userNumber'];

      $user_email = $request['userEmail'];
      $client_email = $request['clientEmail'];
      $user_email = $request['userEmail'];

      // $price = $request['price'];

      $message = '';

      $message = '<strong>materials</strong> <br /> <br /> ';

      $material_data = json_decode($request['materialData']);
      $sizing_data = json_decode($request['sizing']);

      $subject = 'Bespoke Rug Quote';
      // $message = 'here is your rug quote';
      $headers = '';
      $attachments = '';

      $is_client = false;
      $body = sendQuoteEmailTemplate ($is_client, $user_details,  $material_data, $sizing_data, $price);
      wp_mail($user_email, $subject, $body, 'Content-Type: text/html; charset=ISO-8859-1');

      $is_client = true;
      $body = sendQuoteEmailTemplate ($is_client, $user_details,  $material_data, $sizing_data, $price);
      wp_mail($client_email, $subject, $body, 'Content-Type: text/html; charset=ISO-8859-1');


      // return $test;
      return 'sent email';
    },

    /**
     * email select rug choice to user and client
     */
    'email-hospitality-rug-choices' => function () {
      error_log('email rug choices endpoint !!');

      if ( !is_user_logged_in() ) {
        // header( 'Location: ' . site_url() . '/hospitality-register' );
      }

      $email = filter_var( $_POST['from'], FILTER_SANITIZE_EMAIL );

      if ( !filter_var( $_POST['from'], FILTER_VALIDATE_EMAIL ) ) {
        die('invalid email');
      }

      $choices = json_decode(stripslashes( $_POST['choices'] ));
      // $message = '';
      // $user_message = 'Thanks for creating your hospitality collection. Here are the options you selected:
      //   <br /><br />';
      // $client_message = '';
      //
      // foreach ( $choices as $key => $choice ) {
      //   $user_message .= "$key: $choice<br>";
      //   $client_message .= "$key: $choice<br>";
      // }
      //
      // $client_message .= "<br><br>";
      // $user_message .= "<br><br>";
      //
      // $client_message .= "Submitted by $email";

      error_log('user detials --->');
      error_log($email);
      error_log(json_encode($choices,true));
      error_log('<-----');

      $body = hospitalityRugTemplate('user', $email, $choices);
      wp_mail($email, 'New Hospitality Builder Design', $body, 'Content-Type: text/html; charset=ISO-8859-1');

      $body = hospitalityRugTemplate('client', $email, $choices);

      wp_mail('crucial.consumer@crucial-trading.com', 'New Hospitality Builder Design', $body, 'Content-Type: text/html; charset=ISO-8859-1');
      wp_mail('emma.hopkins@crucial-trading.com', 'New Hospitality Builder Design', $body, 'Content-Type: text/html; charset=ISO-8859-1');
      wp_mail('connor@kijo.co', 'New Hospitality Builder Design', $body, 'Content-Type: text/html; charset=ISO-8859-1');

      die('success');
      // return 'email delivered successfully';
    }
  );


  /**
   * Quote email template
   */
  function sendQuoteEmailTemplate ($is_client, $user_details, $materials, $sizing, $price) {
    $template = '';

    $template .= '<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
    		<div id="wrapper"
          dir="ltr"
          style="background-color: #383838; border-radius: 3px 3px 0 0 !important; color: #ffffff; border-bottom: 0;
            font-weight: bold; line-height: 100%; vertical-align: middle; font-family: ;
            margin: 0; padding: 70px 0 70px 0; -webkit-text-size-adjust: none !important; width: 100%;"
          helvetica=""
          neue=""
          roboto=""
          arial=""
          sans-serif=""
        >
    			<table border="0" cellpadding="0" cellspacing="0" height="100px" width="100%">
            <tbody>
              <tr>
                <td align="center" valign="top" style="font-family: Open Sans, sans-serif;">


    						<table border="0" cellpadding="0" cellspacing="0" width="600">
                  <tbody>
                    <tr>
                      <td align="center" valign="top" style="font-family: Open Sans, sans-serif;">
    									</td>
                    </tr>

                    <tr style="background: #383838;">
                      <td id="header_wrapper" style="font-family: Open Sans, sans-serif; padding: 36px 48px; display: block;">
    										<h1 style="font-size: 52px; text-align: center; color: #ffffff; font-family: Playfair Display,
                          serif; font-weight: 300; line-height: 150%; margin: 0; text-shadow: 0 1px 0 #606060; -webkit-font-smoothing: antialiased;"
                        >
    										  Your Bespoke Rug Quote
                        </h1>
    									</td>
    								</tr>
                <!-- End Header -->
                  </tbody>
                </table>
              </td>
    				</tr>
          </tbody>
        </table>
      </div>

    		<!-- Body -->
    		<table border="0" cellpadding="0" cellspacing="0" width="600" id="template_body" style="width: 100%;">
          <tbody>
            <tr style="width: 100%;">
              <td valign="top" id="body_content" style="width: 100%; font-family: Open Sans, sans-serif; background-color: #fdfdfd;">
    				<!-- Content -->
    				<table border="0" cellpadding="20" cellspacing="0" width="100%" style="width: 100%;">
              <tbody>
                <tr style="width: 100%;">
                  <td valign="top" style="width: 100%; font-family: Open Sans, sans-serif; padding: 48px;">
    								<div id="body_content_inner"
                      style="width: 100%; font-family: &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif;
                        color: #737373; font-size: 14px; line-height: 150%; text-align: left;"
                    >';

                    /* is client -> add user details */
                    if ($is_client) {
                      $template .= '
                      <h2
                        style="color: #383838; display: block; font-family: Playfair Display, serif; font-size: 18px; border-bottom: 1px solid grey;
                        font-weight: bold; line-height: 130%; margin: 16px 0 8px; text-align: left; width: 50%;"
                      >
                        Details
                      </h2>';

                      $template .= '<p style="font-family: Open Sans, sans-serif; margin: 0 0 16px;">';

                      $template .= '<strong>Name </strong>  &nbsp; &nbsp;' . $user_details->title . ' ' . $user_details->name;
                      $template .= '<br />';
                      $template .= '<strong>Email </strong> &nbsp &nbsp;' . $user_details->email;
                      $template .= '<br />';
                      $template .= '<strong>Address </strong>  &nbsp; &nbsp;' . $user_details->address;
                      $template .= '<br />';
                      $template .= '<strong>Postcode </strong>  &nbsp; &nbsp;' . $user_details->postcode;
                      $template .= '<br />';
                      $template .= '<strong>Number </strong> &nbsp; &nbsp;' . $user_details->number;
                      $template .= '<br /> <br /> </p>';
                    }

                    $template .= '
                    <h2 style="color: #383838; display: block; font-family: Playfair Display, serif; font-size: 18px; border-bottom: 1px solid grey;
                      font-weight: bold; line-height: 130%; margin: 16px 0 8px; text-align: left; width: 50%;"
                    >
                      Materials
                    </h2>';

                      $template .= '<p style="font-family: Open Sans, sans-serif; margin: 0 0 16px;">';

                      foreach ($materials as $key => $val) {
                        $template .= '<strong>' . $key . '</strong> &nbsp; &nbsp;';
                        $template .= $val;
                        $template .= '<br />';
                      }

                      $template .= '
                        </p>

                        <h2 style="color: #383838; display: block; font-family: Playfair Display, serif; font-size: 18px;
                          font-weight: bold; line-height: 130%; margin: 16px 0 8px; text-align: left; border-bottom: 1px solid grey; width: 40%;"
                        >
                          Sizing
                        </h2>

                        <p style="font-family: Open Sans, sans-serif; margin: 0 0 16px;">';

                        foreach ($sizing as $key => $val) {
                          $template .= '<strong>' . $key . '</strong> &nbsp; &nbsp;';
                          $template .= $val . 'm';
                          $template .= '<br />';
                        }

                        $template .= '</p>

                        <h2 style="color: #383838; display: block; font-family: Playfair Display, serif; font-size: 18px;
                          font-weight: bold; line-height: 130%; margin: 16px 0 8px; text-align: left; border-bottom:1px solid grey; width: 30%;"
                        >
                          Quote
                        </h2>

                        <p style="font-family: Open Sans, sans-serif; margin: 0 0 16px;">';
                          $template .= '£ ' . $user_details->price;
                          $template .= '
                        </p>
    								</div>
    							</td>
    						</tr>
              </tbody>
            </table>
            <!-- End Content -->
          </td>
    		</tr>
      </tbody>
    </table>
    <!-- End Body -->

    </body>';

    return $template;
  }

  /**
   * hospitality Rug Email Template
   */
  function hospitalityRugTemplate ($user, $email, $choices) {
    $template = '';

    $template .= '<body leftmargin="0" marginwidth="0" topmargin="0" margin; height="0" offset="0">
        <div id="wrapper"
          dir="ltr"
          style="background-color: #383838; border-radius: 3px 3px 0 0 !important; color: #ffffff; border-bottom: 0;
            font-weight: bold; line-height: 100%; vertical-align: middle; font-family: ;
            margin: 0; padding: 70px 0 70px 0; -webkit-text-size-adjust: none !important; width: 100%;"
          helvetica=""
          neue=""
          roboto=""
          arial=""
          sans-serif=""
        >
          <table border="0" cellpadding="0" cellspacing="0" height="100px" width="100%">
            <tbody>
              <tr>
                <td align="center" valign="top" style="font-family: Open Sans, sans-serif;">


                <table border="0" cellpadding="0" cellspacing="0" width="600">
                  <tbody>
                    <tr>
                      <td align="center" valign="top" style="font-family: Open Sans, sans-serif;">
                      </td>
                    </tr>

                    <tr style="background: #383838;">
                      <td id="header_wrapper" style="font-family: Open Sans, sans-serif; padding: 36px 48px; display: block;">
                        <h1 style="font-size: 52px; text-align: center; color: #ffffff; font-family: Playfair Display,
                          serif; font-weight: 300; line-height: 150%; margin: 0; text-shadow: 0 1px 0 #606060; -webkit-font-smoothing: antialiased;"
                        >';

                          if ($user === 'user') { $template .= 'Your ';} $template .= 'Bespoke Rug Choices';

                        $template .= '
                        </h1>
                      </td>
                    </tr>
                <!-- End Header -->
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Body -->
      <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_body" style="width: 100%;">
        <tbody>
          <tr style="width: 100%;">
            <td valign="top" id="body_content" style="width: 100%; font-family: Open Sans, sans-serif; background-color: #fdfdfd;">
          <!-- Content -->
          <table border="0" cellpadding="20" cellspacing="0" width="100%" style="width: 100%;">
            <tbody>
              <tr style="width: 100%;">
                <td valign="top" style="width: 100%; font-family: Open Sans, sans-serif; padding: 48px;">
                  <div id="body_content_inner"
                    style="width: 100%; font-family: &quot;Helvetica Neue&quot;, Helvetica, Roboto, Arial, sans-serif;
                      color: #737373; font-size: 14px; line-height: 150%; text-align: left;"
                  >';

                  if ($user === 'user') {
                    $template .= '
                    <h2
                      style="color: #383838; display: block; font-family: Open Sans, sans-serif; font-size: 18px;
                      font-weight: bold; line-height: 130%; margin: 16px 0 8px; text-align: left;"
                    >
                      Thanks for creating your hospitality collection. Here are the options you selected:
                    </h2>';
                    $template .= '<br /><br />';
                  }

                  $template .= '<p style="font-family: Open Sans, sans-serif; margin: 0 0 19px;">';

                    foreach ( $choices as $key => $choice ) {
                      $template .= '<span style="font-weight:bold">' . $key . '</span>:  ' . $choice . "<br>";
                    }

                    $template .= '<br><br>';

                    if ($user === 'client') {
                      $template .= "Submitted by $email";
                    }

                  $template .= '</p>';

                  $template .= '
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- End Content -->
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End Body -->

    </body>';

    return $template;
  }
