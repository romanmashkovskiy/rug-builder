<?php

/**
 * Calculates distance between two UK postcodes
 * NOTE FUNCTION NOT IN USE
 *
 * @param  $from  String  UK Postcode
 * @return String
 */
 function calc_distance($from, $retailer = '') {
   return 0;
   $from = str_replace(' ', '', $from);
   $to = $_GET['postcode'];

   if ($from && $to) {
     $postcode_tags   = strip_tags( $to );
 		$postcode_trim   = trim( $postcode_tags );
 		$postcode_filter = filter_var( $postcode_trim, FILTER_SANITIZE_STRING );

 		$encoded  = urlencode( $postcode_filter );
      $url      = "http://maps.google.com/maps/api/geocode/json?address={$to}";
      $json     = file_get_contents( $url );
      $response = json_decode( $json, true );
      //$response = array_filter($response_['results']);
      var_dump("DISTANCE");
      // if ( !empty( $response['results'] ) && array_key_exists( 'status', $response ) ) {
        $search_lat = $response['results'][0]['geometry']['location']['lat'];
        $search_lng = $response['results'][0]['geometry']['location']['lng'];
        $uk_center  = $search_lat . ' ' . $search_lng;
        $lat = get_post_meta( $retailer->ID, 'retailer_lat', true );
        $lng = get_post_meta( $retailer->ID, 'retailer_lng', true );

        $distance = distance_between_lat_lng( $search_lat, $search_lng, $lat, $lng );

        var_dump("DISTANCE", $distance);
    //  }

      //$distance = distance_between_lat_lng( $search_lat, $search_lng, $retailer->lat, $retailer->lng );
     // $url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=$from&destinations=$to&mode=driving&language=en-EN&sensor=false";
     // $data = @file_get_contents($url);
     //
     // $result = json_decode($data, true);
     // var_dump($result);
     // // Data returned from Google can sometimes be null or empty
     // if ($result['rows']) {
     //
     //   $distance = $result['rows'][0]['elements'][0]['distance']['text'];
     //
     //   // Remove all non-numeric in string
     //   $non_num = preg_replace("/[^0-9,.]/", "", $distance); // from 20.4 Km to 20.4
     //
     //   $miles = ($non_num / 1.609344); // equals miles
     //
     //   return round($miles) . ' miles'; // Convert Km to m
     //}
   }
   return '';
 }

 function calc_distance_number($from, $retailer = '') {
   return 0;
   $to = $_GET['postcode'];
   $from = str_replace(' ', '', $from);

   if ($from && $to) {
     //$url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=$from&destinations=$to&mode=driving&language=en-EN&sensor=false";
     $data = @file_get_contents($url);

     $result = json_decode($data, true);

     // Data returned from Google can sometimes be null or empty
     if ($result['rows']) {

      $distance = $result['rows'][0]['elements'][0]['distance']['text'];

      // Remove all non-numeric in string
      $non_num = preg_replace("/[^0-9,.]/", "", $distance); // from 20.4 Km to 20.4

      $miles = ($non_num / 1.609344); // equals miles

      return round($miles); // Convert Km to m

     }


   }
   return 0;
 }
