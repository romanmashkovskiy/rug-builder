<?php

function render_google_map() {
  $error = false;

  $uk_retailers       = array();
  $overseas_retailers = array();

  $uk_center       = '';
  $overseas_center = '';
  $pin_coords      = '';

  if ( is_array( $_GET ) ) {

    if ( array_key_exists( 'postcode', $_GET ) ) {


      $postcode        = $_GET['postcode'];
      $postcode_tags   = strip_tags( $postcode );
      $postcode_trim   = trim( $postcode_tags );
      $postcode_filter = filter_var( $postcode_trim, FILTER_SANITIZE_STRING );

      $encoded  = urlencode( $postcode_filter );
      $url      = "http://maps.google.com/maps/api/geocode/json?address={$encoded}";
      $json     = file_get_contents( $url );
      $response = json_decode( $json, true );

      if ( is_array( $response ) && array_key_exists( 'status', $response ) ) {

        if ( $response['status'] != 'OK' ) {
          $error = 1;
        } else {

          $search_lat = $response['results'][0]['geometry']['location']['lat'];
          $search_lng = $response['results'][0]['geometry']['location']['lng'];
          $uk_center  = $search_lat . ' ' . $search_lng;

          $args = array(
            'post_type' => 'retailer',

            'posts_per_page' => -1,
            'tax_query' => array(
              array(
                'taxonomy' => 'retailer_type',
                'field'    => 'slug',
                'terms'    => 'retailer',
              ),
            ),
          );

          $query = new WP_Query( $args );

          if ( !$query->have_posts() ) {
            $error = 10;
          } else {

            $retailers = array();

            for ( $i = 0; $i < $query->post_count; $i++ ) {

              $post    = $query->posts[$i];
              $post_id = $post->ID;

              $lat = get_post_meta( $post_id, 'retailer_lat', true );
              $lng = get_post_meta( $post_id, 'retailer_lng', true );

              $post->lat = $lat;
              $post->lng = $lng;

              array_push( $retailers, $post );
            }

            for ( $i2 = 0; $i2 < count( $retailers ); $i2++ ) {

              $distance = distance_between_lat_lng( $search_lat, $search_lng, $retailers[$i2]->lat, $retailers[$i2]->lng );

              if ( $distance < 10 ) {
                $retailers[$i2]->distance = round( $distance );
                array_push( $uk_retailers, $retailers[$i2] );
              }
            }

            /**
             * Sort Array by Google API distance
             */
            usort( $uk_retailers, 'cmp' );

            for ( $i3 = 0; $i3 < count( $uk_retailers ); $i3++ ) {
              $pin_coords .= $uk_retailers[$i3]->lat . ' ' . $uk_retailers[$i3]->lng . ',';
            }
          }
        }
      } else {
        $error = 1;
      }
   }
  }
  echo do_shortcode( '[google-map uk-center="' . $uk_center . '" overseas-center="' . $overseas_center . '" pin-coords="' . $pin_coords . '"]' );
}
