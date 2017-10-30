<?php

/**
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

 function retailer_result_dropdown() {
   return <<<HTML

   <section class="retailer-result-dropdown">
     <div class="retailer-result-dropdown__header">
       <h2>Online Retailers</h2>
     </div>
     <div class="retailer-result-dropdown_menu">
       <div class="retailer-result-dropdown_menu__left">
         <div class="retailer-result-dropdown_menu__left__title">
           The natural rug store
         </div>
       </div>
       <div class="retailer-result-dropdown_menu__right">
         <div class="retailer-result-dropdown_menu__right__miles">
           <span>2 miles</span>
         </div>
         <div class="retailer-result-dropdown_menu__right__retailer-action">
           <span class="retailer-type">online retailer</span>
           <span><i class="fa fa-check" aria-hidden="true"></i></span>
           <span><i class="fa fa-plus" aria-hidden="true"></i></span>
         </div>

       </div>
     </div>
   </section>


HTML;
 }
