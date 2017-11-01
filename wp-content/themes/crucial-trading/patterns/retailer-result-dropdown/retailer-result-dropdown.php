<?php

/**
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

 function retailer_result_dropdown($main_header = '', $dist = '') {
   $showroom_args = array(
   	'post_type' => 'retailer',
   	'orderby'   => 'menu_order',
   	'order'     => 'ASC',
   	'tax_query' => array(
   		array(
   			'taxonomy' => 'retailer_type',
   			'field'    => 'slug',
   			'terms'    => 'showroom',
   		),
   	),
   );

   //echo retailer_result_dropdown();

   $showroom_query = new WP_Query( $showroom_args );
   $loop = '';
   if ( $showroom_query->have_posts() ) :
     foreach ($showroom_query->posts as $show_post) {
       $post_id = $show_post->ID;
       $title = $show_post->post_title;
       $website = rwmb_meta('retailer_website', array(), $show_post->ID);
       $phone_number = rwmb_meta('retailer_telephone_1', array(), $show_post->ID);
       $email = rwmb_meta('retailer_email', array(), $show_post->ID);
       $description = rwmb_meta('retailer_company_decription', array(), $show_post->ID);
       $retailer_logo_meta = get_post_meta($show_post->ID, 'retailer_company_logo');
       $logo_url = count($retailer_logo_meta) > 0 ? wp_get_attachment_url($retailer_logo_meta[0], 'size') : 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder-300x300.png';
       $loop .= retailer_loop($title, $description, $post_id, $email, $phone_number, $logo_url, $website);
     }

   endif;

   return <<<HTML

   <div id="accordion" class="retailer-result-dropdown panel-group">
     <div class="retailer-result-dropdown__header">
       <h2>$main_header</h2>
     </div>
     $loop
   </div>


HTML;
 }

 function retailer_loop($title = '', $description = '', $post_id ='', $email ='', $phone_number = '', $logo_url = '', $website = '', $dist = '', $retailer_loop = false) {

   $retailer_logo_meta = get_post_meta($post_id, 'retailer_company_logo');
   $logo_url = count($retailer_logo_meta) > 0 ? wp_get_attachment_url($retailer_logo_meta[0], 'size') : 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder-300x300.png';

   $combines_address_or_description = $description;
   if ($retailer_loop) {
    $address_1 = rwmb_meta( 'retailer_address_1', array(), $post_id );
   	$address_2 = rwmb_meta( 'retailer_address_2', array(), $post_id );
   	$address_3 = rwmb_meta( 'retailer_address_3', array(), $post_id );
   	$address_4 = rwmb_meta( 'retailer_address_4', array(), $post_id );
   	$address_5 = rwmb_meta( 'retailer_address_5', array(), $post_id );
   	$address_6 = rwmb_meta( 'retailer_town', array(), $post_id );
   	$address_7 = rwmb_meta( 'retailer_county', array(), $post_id );
   	$address_8 = rwmb_meta( 'retailer_postcode', array(), $post_id );

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
   }
   return <<<HTML

   <div class="retailer-result-dropdown_menu">
     <div class="retailer-result-dropdown_menu__left">
       <div class="retailer-result-dropdown_menu__left__title">
         $title
       </div>
     </div>
     <div class="retailer-result-dropdown_menu__right">
       <div class="retailer-result-dropdown_menu__right__miles">
         <span>$dist miles</span>
       </div>
       <div class="retailer-result-dropdown_menu__right__retailer-action">
         <span class="retailer-type">online retailer</span>
         <span><i class="fa fa-check" aria-hidden="true"></i></span>
         <a data-toggle="collapse" data-parent="#accordion" href="#$post_id" class="myelement"><i class="fa fa-plus" aria-hidden="true"></i></a>
       </div>
     </div>
   </div>

   <div id="$post_id" class="retailer-result-dropdown__dropdown panel-collapse collapse">
     <div class="retailer-result-dropdown__dropdown__text-logo">

       <div class="retailer-result-dropdown__dropdown__text-logo__text">
         <p>$combines_address_or_description</p>
         <div class="retailer-result-dropdown__dropdown__text-logo__footer">
           <a href='$website'>visit website</a>
           <a href='tel:$phone_number'>$phone_number</a>
           <a href='mailto:$email'>send email</a>
         </div>
       </div>

       <div class="retailer-result-dropdown__dropdown__text-logo__logo">
         <img src="$logo_url" />
         <p>worked with ct since: 1993</p>
       </div>

     </div>
   </div>

HTML;
 }
