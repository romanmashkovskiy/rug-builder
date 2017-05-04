<?php

  $routes = array(
    /* material data */
    array(
      'endpoint' => 'api/v1/materials-data',
      'methods' => 'GET',
      'callback' => 'materials-data'
    ),



    /* collections data */
    array(
      'endpoint' => 'api/v1/collections-data',
      'methods' => 'GET',
      'callback' => 'collections-data'
    ),


    /* swatches data */
    array(
      'endpoint' => 'api/v1/swatches-data',
      'methods' => 'GET',
      'callback' => 'swatches-data'
    ),


    /* border data */
    array(
      'endpoint' => 'api/v1/borders-data',
      'methods' => 'GET',
      'callback' => 'border-data'
    ),


    /* piping data */
    array(
      'endpoint' => 'api/v1/piping-data',
      'methods' => 'GET',
      'callback' => 'piping-data'
    ),


    /* price data */
    array(
      'endpoint' => 'api/v1/price-data',
      'methods' => 'GET',
      'callback' => 'price-data'
    ),


    /* add rug to cart */
    array(
      'endpoint' => 'api/v1/add-rug-to-cart',
      'methods' => 'GET',
      'callback' => 'add-rug-to-cart'
    )
  );
