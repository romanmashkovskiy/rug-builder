<?php

/**
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

 function retailers($main_header = '', $dist = '', $terms = 'showroom', $online = false ) {
   $showroom_args = array(
   	'post_type' => 'retailer',
   	'orderby'   => 'menu_order',
   	'order'     => 'ASC',
    'posts_per_page' => -1,
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
       $tt = round( $show_post->distance );
       $iterator_ = $show_post->i;
       $retailer_postcode = get_post_meta($show_post->ID, "retailer_postcode", true);

       $loop .= retailer_loop($title, $post_id, '', $online, $retailer_postcode);
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
     'posts_per_page' => -1,
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
     $row = 0;
     foreach ($showroom_query->posts as $show_post) {
       $post_id = $show_post->ID;
       $title = $show_post->post_title;
       $retailer_postcode = get_post_meta($show_post->ID, "retailer_postcode", true);
       //var_dump($dist);
       // $title, $_post_id,  $dist, true, false, $iterator = $i3, true
       $loop .= retailer_loop($title, $post_id, true, false, $row, true, $retailer_postcode);
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

 function retailer_loop($title = '', $post_id ='', $retailer_loop = false, $online, $iterator = 0, $search = false, $retailer_postcode = '') {
   $slogan = rwmb_meta('retailer_logo_slogan', array(), $post_id) ? rwmb_meta('retailer_logo_slogan', array(), $post_id) : '';
   $website = rwmb_meta('retailer_website', array(), $post_id);
   $phone_number = rwmb_meta('retailer_telephone_1', array(), $post_id);
   $email = rwmb_meta('retailer_email', array(), $post_id);
   $description = rwmb_meta('retailer_company_decription', array(), $post_id);
   $retailer_logo_meta = get_post_meta($post_id, 'retailer_company_logo');
   $logo_url = count($retailer_logo_meta) > 0 ? wp_get_attachment_url($retailer_logo_meta[0], 'size') : '';
   $retailer_logo_meta = get_post_meta($post_id, 'retailer_company_logo');
   $logo_url = count($retailer_logo_meta) > 0 ? wp_get_attachment_url($retailer_logo_meta[0], 'size') : '';

   // Images
   $plus_icon = get_template_directory_uri() . '/assets/icons/plus.svg';
   $tick_icon = get_template_directory_uri() . '/assets/icons/tick.svg';

   $km = null;
   if  (array_key_exists('postcode', $_GET)) {
     $km = calc_distance($retailer_postcode);
   }

   $new_iterator = '';
   if ($search) {
     $new_iterator = $iterator + 1;
   }

   $logo_html = '';
   if (! empty($logo_url)) {
     $logo_html = "<img src='$logo_url' />";
   }

   /* When true, this is called for the search results in retailer.php around line 191 */
   if (!$online) {
    $address_1 = rwmb_meta( 'retailer_address_1', array(), $post_id );
   	$address_2 = rwmb_meta( 'retailer_address_2', array(), $post_id );
   	$address_3 = rwmb_meta( 'retailer_address_3', array(), $post_id );
   	$address_4 = rwmb_meta( 'retailer_address_4', array(), $post_id );
   	$address_5 = rwmb_meta( 'retailer_address_5', array(), $post_id );
   	$address_6 = rwmb_meta( 'retailer_town', array(), $post_id );
   	$address_7 = rwmb_meta( 'retailer_county', array(), $post_id );
   	$address_8 = rwmb_meta( 'retailer_postcode', array(), $post_id );
    $phone_number = rwmb_meta('retailer_telephone_1', array(), $post_id) ? rwmb_meta('retailer_telephone_1', array(), $post_id) : '';

    $retailer_type = "Showroom";


    $combines_address_or_description = '';

  	if ( $address_1 != '' ) {
  		$combines_address_or_description .= $address_1;
  	}
  	if ( $address_2 != '' ) {
  		$combines_address_or_description .= "<br>" . $address_2;
  	}
  	if ( $address_3 != '' ) {
  		$combines_address_or_description .= "<br>" . $address_3;
  	}
  	if ( $address_4 != '' ) {
  		$combines_address_or_description .= "<br>" . $address_4;
  	}
  	if ( $address_5 != '' ) {
  		$combines_address_or_description .= "<br>" . $address_5;
  	}
  	if ( $address_6 != '' ) {
  		$combines_address_or_description .= "<br>" . $address_6;
  	}
  	if ( $address_7 != '' ) {
  		$combines_address_or_description .= "<br>" . $address_7;
  	}
  	if ( $address_8 != '' ) {
  		$combines_address_or_description .= "<br>" . $address_8;
  	}

    $queried_postcode = '';
    if  (array_key_exists('postcode', $_GET)) {
      $queried_postcode = $_GET['postcode'];
    }



    // Footer <a> list
    $lat = get_post_meta( $post_id, 'retailer_lat', true );
  	$lng = get_post_meta( $post_id, 'retailer_lng', true );
    // crucial: http://maps.google.com/maps?saddr=52.50883313,-2.07817228&daddr=ws1 3qu
  	$url = 'http://maps.google.com/maps?saddr=' . $lat . ',' . $lng . '&daddr=' . $queried_postcode;
    $footer_a_list = "<a class='r_website' href='$url'>Get Directions</a>";

  } else {

    $retailer_type = "Online Retailer";
    $footer_a_list = "<a class='r_website' href='$website'>visit website</a>";
    $combines_address_or_description = $description;
  }

   return <<<HTML

   <a data-toggle="collapse" data-parent="#accordion" href="#$post_id" id='retailer_$new_iterator' class="open-acc retailer-result-dropdown_menu r_accordion">
     <div class="retailer-result-dropdown_menu__left">
       <div class="retailer-result-dropdown_menu__left__title r_title">
         $title
       </div>
       <img class="retailer-result-dropdown_menu__left__title--mobile" src='$plus_icon' />
     </div>
     <div class="retailer-result-dropdown_menu__right">
       <div class="retailer-result-dropdown_menu__right__miles">
         <span class='r_distance'>$km</span>
       </div>
       <div class="retailer-result-dropdown_menu__right__retailer-action">
         <!-- <span class="retailer-type">$retailer_type</span> -->
         <!-- <span><img src='$tick_icon' /></span> -->
         <img class="retailer-result-dropdown_menu__right__retailer-action--desktop" src='$plus_icon' />
       </div>
     </div>
   </a>

   <div id="$post_id" class="retailer-result-dropdown__dropdown panel-collapse collapse retailer_$new_iterator">
     <div class="retailer-result-dropdown__dropdown__text-logo">

       <div class="retailer-result-dropdown__dropdown__text-logo__text">
         <p>$combines_address_or_description</p>
         <div class="retailer-result-dropdown__dropdown__text-logo__footer">
           $footer_a_list
           <a href='tel:$phone_number'>$phone_number</a>
           <a href='mailto:$email'>send email</a>
         </div>
       </div>

       <div class="retailer-result-dropdown__dropdown__text-logo__logo">
         $logo_html
         <p>$slogan</p>
       </div>

     </div>
   </div>

HTML;
 }
