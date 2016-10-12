<?php 
/** 
KIJO Framework

Dashboard widget & remove WordPress default widgets 

**/

/************************************************************************************
Remove Dashboard Widgets
*************************************************************************************/

function remove_dashboard_meta() {
        remove_meta_box( 'dashboard_incoming_links', 'dashboard', 'normal' );
        remove_meta_box( 'dashboard_plugins', 'dashboard', 'normal' );
        remove_meta_box( 'dashboard_primary', 'dashboard', 'side' );
        //remove_meta_box( 'dashboard_secondary', 'dashboard', 'normal' );
        remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
        remove_meta_box( 'dashboard_recent_drafts', 'dashboard', 'side' );
        //remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'normal' );
        remove_meta_box( 'dashboard_right_now', 'dashboard', 'normal' );
        remove_meta_box( 'dashboard_browser_nag', 'dashboard', 'normal' );
        remove_meta_box( 'dashboard_activity', 'dashboard', 'normal');//since 3.8
}
add_action( 'wp_dashboard_setup', 'remove_dashboard_meta' );

remove_action( 'welcome_panel', 'wp_welcome_panel' );

/************************************************************************************
Create Dashboard Widget
*************************************************************************************/

/**
 * Add a widget to the dashboard.
 *
 * This function is hooked into the 'wp_dashboard_setup' action below.
 */
function kijo_add_dashboard_widgets() {
  $sitename = get_bloginfo('name');
	wp_add_dashboard_widget(
                 'kijo_dashboard_widget',         // Widget slug.
                 ' '.$sitename.' Dashboard',         // Title.
                 'kijo_dashboard_widget_function' // Display function.
        );	
}
add_action( 'wp_dashboard_setup', 'kijo_add_dashboard_widgets' );

/**
 * Create the function to output the contents of our Dashboard Widget.
 */
function kijo_dashboard_widget_function() {
  $sitename = get_bloginfo('name');
  $logo = kijo_framework_logo();
	echo "<div class=kijo-dash-container><img src=$logo><h1 class=kijo-dash-title><span class=site-name>$sitename</span>Website Dashboard </h1></div>";
}

/**
 * Widgets Full Width
 */
function kijo_framework_dashboard_columns() {
    add_screen_option(
        'layout_columns',
        array(
            'max'     => 2,
            'default' => 1
        )
    );
}
add_action( 'admin_head-index.php', 'kijo_framework_dashboard_columns' );

?>