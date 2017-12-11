<?php

/**
 * Calculates distance between two UK postcodes
 *
 * @param  $from  String  UK Postcode
 * @return String
 */
 function calc_distance($from) {
   $to = $_GET['postcode'];

   if ($from && $to) {
     $base_url = 'https://maps.googleapis.com/maps/api/directions/xml?&key=AIzaSyCHgDqWhs3PQTM-qzsZwLQO99UhFgVi5Tk&sensor=false';
     $xml = simplexml_load_file("$base_url&origin=$from&destination=$to");
     $distance = (string)$xml->route->leg->distance->text;
     $duration = (string)$xml->route->leg->duration->text;

     // Remove all non-numeric in string
     $non_num = preg_replace("/[^0-9,.]/", "", $distance); // from 20.4 Km to 20.4

     $miles = ($non_num / 1.609344); // equals miles

     return round($miles) . ' miles'; // Convert Km to m
   }
   return '';
 }

 function calc_distance_number($from) {
   $to = $_GET['postcode'];

   if ($from && $to) {
     $base_url = 'https://maps.googleapis.com/maps/api/directions/xml?&key=AIzaSyCHgDqWhs3PQTM-qzsZwLQO99UhFgVi5Tk&sensor=false';
     $xml = simplexml_load_file("$base_url&origin=$from&destination=$to");
     $distance = (string)$xml->route->leg->distance->text;
     $duration = (string)$xml->route->leg->duration->text;

     // Remove all non-numeric in string
     $non_num = preg_replace("/[^0-9,.]/", "", $distance); // from 20.4 Km to 20.4

     $miles = ($non_num / 1.609344); // equals miles

     return round($miles); // Convert Km to m
   }
   return '';
 }
