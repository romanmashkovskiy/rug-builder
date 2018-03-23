<?

function overseas_retailers() {
  if ( array_key_exists( 'country', $_GET ) ) {
    $overseas_retailers = array();
    $pin_coords      = '';
    $country = $_GET['country'];
  	$enccoun = urlencode( $country );

  	$url      = "http://maps.google.com/maps/api/geocode/json?address={$enccoun}";
  	$json     = file_get_contents( $url );
  	$response = json_decode( $json, true );

  	if ( is_array( $response ) && array_key_exists( 'status', $response ) ) {

  		if ( $response['status'] == 'OK' ) {
  			$overseas_center  = $response['results'][0]['geometry']['location']['lat'] . ' ' . $response['results'][0]['geometry']['location']['lng'];
  		} else {
  			$error = 10;
  		}
  	} else {
  		$error = 10;
  	}

  	$args = array(
  		'post_type' => 'retailer',
  		'orderby'   => 'menu_order',
  		'order'     => 'ASC',
  		'posts_per_page' => -1,
  		'tax_query' => array(
  			array(
  				'taxonomy' => 'retailer_type',
  				'field'    => 'slug',
  				'terms'    => 'overseas',
  			),
  		),
  	);

    $query = new WP_Query( $args );

    if ( !$query->have_posts() ) {
  			$error = 10;
  		} else {

  			for ( $i = 0; $i < $query->post_count; $i++ ) {

  				$post         = $query->posts[$i];
  				$post_id      = $post->ID;
  				$post_country = strtolower( rwmb_meta( 'retailer_country', array(), $post_id ) );

  				if ( $country == $post_country ) {

  					$lat = get_post_meta( $post_id, 'retailer_lat', true );
  					$lng = get_post_meta( $post_id, 'retailer_lng', true );

  					$pin_coords .= $lat . ' ' . $lng . ',';
  					array_push( $overseas_retailers, $post );
  				}
  			}
  	 }
     // Show Overseas View
    if ( count( $overseas_retailers ) > 0 ) {
      $query = ucwords( $_GET['country'] );
      echo (
    		"<div class='r_card clearfix'>
    			<h2 class='page-subtitle'>Overseas Partners</h2>
    			<span></span>
          <!-- <p class=''>You've selected: $query</p> -->
    		</div>"
    	);
      for ( $i4 = 0; $i4 < count( $overseas_retailers ); $i4++ ) {
        echo do_shortcode( '[retailer-card id="' . $overseas_retailers[$i4]->ID . '" distance="overseas" i="' . $i4 . '"]' );
      }

    }
  }
}
