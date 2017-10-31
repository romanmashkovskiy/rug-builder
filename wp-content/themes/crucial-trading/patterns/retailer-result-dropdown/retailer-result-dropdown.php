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

 function retailer_loop($title = '', $description = '', $post_id ='', $email ='', $phone_number = '', $logo_url = '', $website = '', $dist = '') {
   return <<<HTML

   <div class="retailer-result-dropdown_menu">
     <div class="retailer-result-dropdown_menu__left">
       <div class="retailer-result-dropdown_menu__left__title">
         $title
       </div>
     </div>
     <div class="retailer-result-dropdown_menu__right">
       <div class="retailer-result-dropdown_menu__right__miles">
         <span>2 miles</span>
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
         <p>$description</p>
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
