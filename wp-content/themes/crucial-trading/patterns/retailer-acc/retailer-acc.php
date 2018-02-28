<?php

function retailer_acc($retailer_type = '', $terms = '', $uk_retailers_ = '', $key = 'postcode') {
  $error = false;

  $uk_retailers       = array();
  $overseas_retailers = array();

  $uk_center       = '';
  $overseas_center = '';
  $pin_coords      = '';

  if ( is_array( $_GET ) ) {

  	if ( array_key_exists( $key, $_GET ) ) {


  		$key_type        = $_GET[$key];
  		$postcode_tags   = strip_tags( $key_type );
  		$postcode_trim   = trim( $postcode_tags );
  		$postcode_filter = filter_var( $postcode_trim, FILTER_SANITIZE_STRING );

  		$encoded  = urlencode( $postcode_filter );
  		$url      = "https://maps.google.com/maps/api/geocode/json?&key=AIzaSyCHgDqWhs3PQTM-qzsZwLQO99UhFgVi5Tk&address={$encoded}";
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
  							'terms'    => $terms,
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
              $post_country = strtolower( rwmb_meta( 'retailer_country', array(), $post_id ) );

  						$lat = get_post_meta( $post_id, 'retailer_lat', true );
  						$lng = get_post_meta( $post_id, 'retailer_lng', true );

  						$post->lat = $lat;
  						$post->lng = $lng;

  						array_push( $retailers, $post );

              // Check for ovverseas
              if ( $key_type == $post_country ) {

      					$lat = get_post_meta( $post_id, 'retailer_lat', true );
      					$lng = get_post_meta( $post_id, 'retailer_lng', true );

      					$pin_coords .= $lat . ' ' . $lng . ',';
      					array_push( $overseas_retailers, $post );
      				}
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

  $uk_retailers = $uk_retailers_ != '' ? $uk_retailers_ : $uk_retailers;

  // Render Local Retailer
  echo loop_render($uk_retailers, $retailer_type);
  // Render Overseas Retailer
  echo loop_render($overseas_retailers, $retailer_type);

}

// TODO: Put in Class and DRY up
function loop_render($retailer, $retailer_type) {
  if ( count( $retailer ) > 0 ) {

    echo (
      "<div class='retailer-result-dropdown panel-group'>
        <div class='retailer-result-dropdown__header'>
          <h2>$retailer_type</h2>
        </div>"
    );

    echo cards_view_render_new($retailer);
    echo "</div>";

    echo (
  		"<div class='r_card r_card__container clearfix'>
  			<h2 class='page-subtitle'>Local Retailers</h2>
  			<span></span>
  			<div class='r_card__wrapper clearfix'>"
  	);

    echo cards_view_render_old($retailer);

    echo "</div></div>";
  }
}

function cards_view_render_new($retailer) {
  for ( $i3 = 0; $i3 < count( $retailer ); $i3++ ) {
    $dist = round( $retailer[$i3]->distance );
    $iterator = 1 + $i3;

    $post_type = $retailer[$i3]->post_type;
    $id = $retailer[$i3]->ID;
    $title = $post_id = $retailer[$i3]->post_title;
    echo retailer_loop($dist, $id, $title, $iterator);
  }
}

function cards_view_render_old($retailer) {
  for ( $i3 = 0; $i3 < count( $retailer ); $i3++ ) {
    $dist = round( $retailer[$i3]->distance );
    $iterator = 1 + $i3;
    $id = $retailer[$i3]->ID;
    /**
     * Cards for original layout
     * Only show once
     */
    echo do_shortcode( '[retailer-card id="' . $id . '" distance="' . $dist . '" i="' . $iterator . '"]' );
  }
}
