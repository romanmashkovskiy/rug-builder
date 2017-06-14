<?php

  $routes = array(
    /* material data */
    array(
      'endpoint' => '/materials-data',
      'methods' => 'GET',
      'callback' => 'materials-data'
    ),


    /* collections data */
    array(
      'endpoint' => '/collections-data',
      'methods' => 'GET',
      'callback' => 'collections-data'
    ),


    /* swatches data */
    array(
      'endpoint' => '/swatches-data',
      'methods' => 'GET',
      'callback' => 'swatches-data'
    ),


    /* border data */
    array(
      'endpoint' => '/borders-data',
      'methods' => 'GET',
      'callback' => 'border-data'
    ),


    /* piping data */
    array(
      'endpoint' => '/piping-data',
      'methods' => 'GET',
      'callback' => 'piping-data'
    ),


    /* price data */
    array(
      'endpoint' => '/price-data',
      'methods' => 'GET',
      'callback' => 'price-data'
    ),


    /* add rug to cart */
    array(
      'endpoint' => '/add-rug-to-cart',
      'methods' => 'GET',
      'callback' => 'add-rug-to-cart'
    )
  );
