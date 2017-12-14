<?php

/**
 * Calculates distance between two UK postcodes
 *
 * @param  $from  String  UK Postcode
 * @return String
 */
 function calc_distance($from) {
   $from = str_replace(' ', '', $from);
   $to = $_GET['postcode'];

   if ($from && $to) {
     $url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=$from&destinations=$to&mode=driving&language=en-EN&sensor=false";
     $data = @file_get_contents($url);

     $result = json_decode($data, true);
     $distance = $result['rows'][0]['elements'][0]['distance']['text'];

     // Remove all non-numeric in string
     $non_num = preg_replace("/[^0-9,.]/", "", $distance); // from 20.4 Km to 20.4

     $miles = ($non_num / 1.609344); // equals miles

     return round($miles) . ' miles'; // Convert Km to m
   }
   return '';
 }

 function calc_distance_number($from) {
   return 0;
   $to = $_GET['postcode'];
   $from = str_replace(' ', '', $from);

   if ($from && $to) {
     $url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=$from&destinations=$to&mode=driving&language=en-EN&sensor=false";
     $data = @file_get_contents($url);

     $result = json_decode($data, true);
     $distance = $result['rows'][0]['elements'][0]['distance']['text'];

     // Remove all non-numeric in string
     $non_num = preg_replace("/[^0-9,.]/", "", $distance); // from 20.4 Km to 20.4

     $miles = ($non_num / 1.609344); // equals miles

     return round($miles); // Convert Km to m
   }
   return '';
 }
