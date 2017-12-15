<?php

 function fixed_retailers($main_header, $terms, $view ='') {
   $showroom_args = array(
   	'post_type' => 'retailer',
   	'orderby'   => 'menu_order',
   	'order'     => 'ASC',
    'posts_per_page' => 3,
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
       $id = $show_post->ID;
       $title = $show_post->post_title;
       $loop .= retailer_loop('', $id, $title, '', '', 'homepage');
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
