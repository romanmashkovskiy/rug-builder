<?

/**
 * Gets json data from the Google API
 * @return Object
 */
function query_google_api() {
  $postcode        = $_GET['postcode'];
  $postcode_tags   = strip_tags( $postcode );
  $postcode_trim   = trim( $postcode_tags );
  $postcode_filter = filter_var( $postcode_trim, FILTER_SANITIZE_STRING );

  $encoded  = urlencode( $postcode_filter );
  $url      = "https://maps.google.com/maps/api/geocode/json?&key=AIzaSyCHgDqWhs3PQTM-qzsZwLQO99UhFgVi5Tk&address={$encoded}";
  $json     = file_get_contents( $url );
  $response = json_decode( $json, true );

  if ( is_array( $response ) && array_key_exists( 'status', $response ) ) {
    if ( $response['status'] == 'OK' ) {
      $search_lat = $response['results'][0]['geometry']['location']['lat'];
      $search_lng = $response['results'][0]['geometry']['location']['lng'];

      return (object) [
        'search_lat' => $search_lat,
        'search_lng' => $search_lng,
        'status' => true,
      ];

    }
  }

  return (object)['status' => false];
}
