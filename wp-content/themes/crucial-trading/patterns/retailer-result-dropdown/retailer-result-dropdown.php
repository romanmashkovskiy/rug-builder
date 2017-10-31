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

   <div id="accordion" class="retailer-result-dropdown panel-group">

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
           <a data-toggle="collapse" data-parent="#accordion" href="#collapse1" class="myelement"><i class="fa fa-plus" aria-hidden="true"></i></a>
         </div>
       </div>
     </div>

     <div id="collapse1" class="retailer-result-dropdown__dropdown panel-collapse collapse in">
       <div class="retailer-result-dropdown__dropdown__text-logo">

         <div class="retailer-result-dropdown__dropdown__text-logo__text">
           <p>Short description of the company in question, this will be simple and straight forward, nothing too over the top maybe a small history of the company and crucial trading.</p>
           <div class="retailer-result-dropdown__dropdown__text-logo__footer">
             <a>visit website</a>
             <a>0121223232</a>
             <a>send email</a>
           </div>
         </div>

         <div class="retailer-result-dropdown__dropdown__text-logo__logo">
           <img src="https://pbs.twimg.com/profile_images/621710855642742784/vFstvJsT.png" />
           <p>worked with ct since: 1993</p>
         </div>
       </div>
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
           <a data-toggle="collapse" data-parent="#accordion" href="#collapse2" class="myelement"><i class="fa fa-plus" aria-hidden="true"></i></a>
         </div>
       </div>
     </div>

     <div id="collapse2" class="retailer-result-dropdown__dropdown panel-collapse collapse">
       <div class="retailer-result-dropdown__dropdown__text-logo">
         <div class="retailer-result-dropdown__dropdown__text-logo__text">
           Short description of the company in question, this will be simple and straight forward, nothing too over the top maybe a small history of the company and crucial trading.
         </div>
         <div class="retailer-result-dropdown__dropdown__text-logo__logo">
           logo
         </div>
       </div>
     </div>


     <!-- <div class="retailer-result-dropdown panel-group panel-group" id="accordion">
       <div class="panel panel-default">
         <div class="panel-heading">
           <h4 class="panel-title">
             <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">
             Collapsible Group 1</a>
           </h4>
         </div>
         <div id="collapse1" class="panel-collapse collapse">
           <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
           sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
           minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
           commodo consequat.</div>
         </div>
       </div>
       <div class="panel panel-default">
         <div class="panel-heading">
           <h4 class="panel-title">
             <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">
             Collapsible Group 2</a>
           </h4>
         </div>
         <div id="collapse2" class="panel-collapse collapse">
           <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
           sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
           minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
           commodo consequat.</div>
         </div>
       </div>
       <div class="panel panel-default">
         <div class="panel-heading">
           <h4 class="panel-title">
             <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">
             Collapsible Group 3</a>
           </h4>
         </div>
         <div id="collapse3" class="panel-collapse collapse">
           <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,
           sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
           minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
           commodo consequat.</div>
         </div>
       </div>
     </div> -->


   </div>


HTML;
 }
