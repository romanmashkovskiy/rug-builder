<?php

/**
 * Displays data for Studio Retailers
 */
function studio_acc($uk_retailers_ = '') {

  $error = false;
  $uk_retailers     = array();
  $pin_coords      = '';

  if ( is_array( $_GET ) ) {

  	if ( array_key_exists( 'postcode', $_GET ) ) {

      // Retrieve data from the Google API
      $api_obj = query_google_api();

			$args = array(
				'post_type' => 'retailer',

				'posts_per_page' => -1,
				'tax_query' => array(
					array(
						'taxonomy' => 'retailer_type',
						'field'    => 'slug',
						'terms'    => 'studio',
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

          if ($api_obj->status) {
            $distance = distance_between_lat_lng( $api_obj->search_lat, $api_obj->search_lng, $retailers[$i2]->lat, $retailers[$i2]->lng );
          } else {
            $distance = distance_between_lat_lng( 0.0, 0.0, $retailers[$i2]->lat, $retailers[$i2]->lng );
          }

          $retailers[$i2]->distance = round( $distance );
          array_push( $uk_retailers, $retailers[$i2] );
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
  }

  // Outside the loop
  if ( count( $uk_retailers ) > 0 ) {

    $local_html = (
      "<div class='retailer-result-dropdown panel-group'>
        <div class='retailer-result-dropdown__header'>
          <h2>Studio Retailers</h2>
        </div>"
    );

    for ( $i3 = 0; $i3 < count( $uk_retailers ); $i3++ ) {
      $dist = round( $uk_retailers[$i3]->distance );
      $post_type = $uk_retailers[$i3]->post_type;
      $id = $uk_retailers[$i3]->ID;
      $title = $post_id = $uk_retailers[$i3]->post_title;
      $local_html .= retailer_loop($dist, $id, $title, $i3);
    }

    $local_html .= (
      "</div>"
    );

    echo $local_html;
  }

  $msg = '';

  switch ( $error ) {
    case 1  : $msg = 'Sorry, we could not find that post code.'; break;
    case 2  : $msg = 'Sorry, there are no retailers in your area.'; break;
    case 10 : $msg = 'Sorry, an error has occured.'; break;
  }

  $errorHtml = (
    "<div class='retailer-result-dropdown panel-group'>
      <div class='retailer-result-dropdown__header'>
        <h2>Studio Retailers</h2>
      </div>
      <div class='retailer-result-dropdown_menu'>$msg</div>
    </div>"
  );

  if ($error) {
    echo $errorHtml;
  }

}
