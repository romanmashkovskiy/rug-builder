<?php

/**
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 * @NOTE FUNCTION NOT IN USE
 */

 function retailers($main_header = '', $dist = '', $terms = 'showroom', $online = false ) {
   $showroom_args = array(
   	'post_type' => 'retailer',
   	'orderby'   => 'menu_order',
   	'order'     => 'ASC',
    'posts_per_page' => 5,
   	'tax_query' => array(
   		array(
   			'taxonomy' => 'retailer_type',
   			'field'    => 'slug',
   			'terms'    => $terms,
   		),
   	),
   );

   $showroom_query = new WP_Query( $showroom_args );
   $loop = '';
   if ( $showroom_query->have_posts() ) :
     foreach ($showroom_query->posts as $show_post) {
       $post_id = $show_post->ID;
       $title = $show_post->post_title;
       $dist = round( $show_post->distance );
       $iterator_ = $show_post->i;
       $retailer_postcode = get_post_meta($show_post->ID, "retailer_postcode", true);

       $loop .= retailer_loop($dist, $post_id);
     }

   endif;

   return <<<HTML

   <div class="retailer-result-dropdown panel-group">
     <div class="retailer-result-dropdown__header">
       <h2>$main_header</h2>
     </div>
     $loop
   </div>


HTML;
 }


 // TODO: Refactor later as this duplication is wrong!!
 function studio_retailers($main_header = '', $terms = 'studio', $online = false, $uk_retailers ) {
   $showroom_args = array(
     'post_type' => 'retailer',
     'orderby'   => 'menu_order',
     'order'     => 'ASC',
     'posts_per_page' => 5,
     'tax_query' => array(
       array(
         'taxonomy' => 'retailer_type',
         'field'    => 'slug',
         'terms'    => $terms,
       ),
     ),
   );

   $showroom_query = new WP_Query( $showroom_args );
   usort( $showroom_query->posts, 'cmp_' );

   $loop = '';
   if ( $showroom_query->have_posts() ) :
     $row = 0;
     foreach ($showroom_query->posts as $show_post) {
       $post_id = $show_post->ID;
       $title = $show_post->post_title;
       //$lat = get_post_meta( $show_post->ID, 'retailer_lat', true );
       //var_dump($lat);
       $retailer_postcode = get_post_meta($show_post->ID, "retailer_postcode", true);
       //var_dump($dist);
       // $title, $_post_id,  $dist, true, false, $iterator = $i3, true
       $loop .= retailer_loop($dist, $post_id);
       $row++;
     }

   endif;

   return <<<HTML

   <div class="retailer-result-dropdown panel-group">
     <div class="retailer-result-dropdown__header">
       <h2>$main_header</h2>
     </div>
     $loop
   </div>


HTML;
 }
