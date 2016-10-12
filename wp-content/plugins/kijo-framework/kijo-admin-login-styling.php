<?php 
/** 
KIJO Framework
Admin area login styling 

**/


/************************************************************************************
** Logo Styling
*************************************************************************************/

function my_custom_login_logo() {
	
		global $plugins_url;
		
		$logo = kijo_framework_logo();
		$logo_retina = kijo_framework_logo_retina();
		
    echo '<style type="text/css">
			
			.login h1 a {
				background-image: url('. $logo .');
			}
			
			@media screen and (-webkit-min-device-pixel-ratio: 2), screen and (max--moz-device-pixel-ratio: 2) {
				.login h1 a {
					background-image: url('. $logo_retina .');
				}
			}
			
    </style>';
}
add_action('login_head', 'my_custom_login_logo');

// Login logo url
function my_custom_login_url() {
  return site_url();
}
add_filter( 'login_headerurl', 'my_custom_login_url', 10, 4 );

// Title of logo
function my_custom_login_title() {
  $sitename = get_bloginfo('name');
  return ('Login to  '. $sitename .'');
}
add_filter( 'login_headertitle', 'my_custom_login_title', 10, 4 );

?>