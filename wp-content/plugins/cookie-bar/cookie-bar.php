<?php
/*
Plugin Name: Cookie Bar
Plugin URI: https://www.brontobytes.com/
Description: Cookie Bar allows you to discreetly inform visitors that your website uses cookies.
Author: Brontobytes
Author URI: https://www.brontobytes.com/
Version: 1.8
License: GPLv2
*/

if ( ! defined( 'ABSPATH' ) )
	exit;

function cookie_bar_menu() {
	add_options_page('Cookie Bar Settings', 'Cookie Bar', 'administrator', 'cookie-bar-settings', 'cookie_bar_settings_page', 'dashicons-admin-generic');
}
add_action('admin_menu', 'cookie_bar_menu');

function cookie_bar_settings_page() { ?>
<script>
jQuery(document).ready(function($){
    $(".cookie_bar_btn_bg_colour").wpColorPicker();
});
</script>
<div class="wrap">
<h2><?php _e('Cookie Bar Settings', 'cookie-bar'); ?></h2>
<p><?php _e('Cookie Bar allows you to discreetly inform visitors that your website uses cookies.', 'cookie-bar'); ?></p>
<form method="post" action="options.php">
    <?php settings_fields( 'cookie-bar-settings' ); ?>
    <?php do_settings_sections( 'cookie-bar-settings' ); ?>
    <table class="form-table">
        <tr valign="top">
        <th scope="row"><?php _e('Cookie Bar Message', 'cookie-bar'); ?></th>
        <td><input type="text" size="100" name="cookie_bar_message" value="<?php echo esc_html( get_option('cookie_bar_message') ); ?>" /> <small>HTML allowed - Ex.<xmp>By continuing to browse the site you are agreeing to our <a href='http://www.aboutcookies.org/' target='_blank' rel='nofollow'>use of cookies</a>.</xmp></small></td>
        </tr>
        <tr valign="top">
        <th scope="row"><?php _e('Button Text', 'cookie-bar'); ?></th>
        <td><input type="text" size="20" name="cookie_bar_button" value="<?php echo esc_attr( get_option('cookie_bar_button') ); ?>" /> <small>Ex. I Understand</small></td>
        </tr>
        <tr valign="top">
        <th scope="row"><?php _e('Button Colour', 'cookie-bar'); ?></th>
        <td><input type="text" name="cookie_bar_btn_bg_colour" value="<?php echo esc_attr( get_option('cookie_bar_btn_bg_colour') ); ?>" class="cookie_bar_btn_bg_colour" data-default-color="#45AE52" /></td>
        </tr>
    </table>
    <?php submit_button(); ?>
</form>
<p>We are very happy to be able to provide this and other <a href="https://www.brontobytes.com/blog/c/wordpress-plugins/">free WordPress plugins</a>.</p>
<p>Plugin developed by <a href="https://www.brontobytes.com/"><img width="100" style="vertical-align:middle" src="<?php echo plugins_url( 'images/brontobytes.svg', __FILE__ ) ?>" alt="Web hosting provider"></a></p>
</div>
<?php }

function cookie_bar_settings() {
	register_setting( 'cookie-bar-settings', 'cookie_bar_message' );
	register_setting( 'cookie-bar-settings', 'cookie_bar_button' );
	register_setting( 'cookie-bar-settings', 'cookie_bar_btn_bg_colour' );
}
add_action( 'admin_init', 'cookie_bar_settings' );

function cookie_bar_deactivation() {
    delete_option( 'cookie_bar_message' );
    delete_option( 'cookie_bar_button' );
    delete_option( 'cookie_bar_btn_bg_colour' );
}
register_deactivation_hook( __FILE__, 'cookie_bar_deactivation' );

function cookie_bar_dependencies() {
	wp_register_script( 'cookie-bar-js', plugins_url('js/cookie-bar.js', __FILE__), array('jquery'), time(), false );
	wp_enqueue_script( 'cookie-bar-js' );
	wp_register_style( 'cookie-bar-css', plugins_url('css/cookie-bar.css', __FILE__) );
	wp_enqueue_style( 'cookie-bar-css' );
}
add_action( 'wp_enqueue_scripts', 'cookie_bar_dependencies' );

class cookie_bar_languages {
    public static function loadTextDomain() {
        load_plugin_textdomain('cookie-bar', false, dirname(plugin_basename(__FILE__ )) . '/languages/');
    }
}
add_action('plugins_loaded', array('cookie_bar_languages', 'loadTextDomain'));

function cookie_bar_color_picker( $hook_suffix ) {
    // first check that $hook_suffix is appropriate for your admin page
    wp_enqueue_style( 'wp-color-picker' );
    wp_enqueue_script( 'cookie-bar-color-picker', plugins_url('js/cookie-bar.js', __FILE__ ), array( 'wp-color-picker' ), false, true );
}
add_action( 'admin_enqueue_scripts', 'cookie_bar_color_picker' );

function cookie_bar() {
$cookie_bar_message_output = get_option( 'cookie_bar_message' );
$cookie_bar_button_output = esc_attr( get_option('cookie_bar_button') );
if ( empty( $cookie_bar_message_output ) ) $cookie_bar_message_output = "By continuing to browse the site you are agreeing to our <a href='http://www.aboutcookies.org/' target='_blank' rel='nofollow'>use of cookies</a>.";
if ( empty( $cookie_bar_button_output ) ) $cookie_bar_button_output = "I Understand";
?>
<!-- Cookie Bar -->
<div id="eu-cookie-bar"><?php echo $cookie_bar_message_output; ?> <button id="euCookieAcceptWP" <?php if (get_option('cookie_bar_btn_bg_colour') == true) { ?> style="background:<?php echo esc_attr( get_option('cookie_bar_btn_bg_colour') ); ?>;" <?php } ?> onclick="euAcceptCookiesWP();"><?php echo $cookie_bar_button_output; ?></button></div>
<!-- End Cookie Bar -->
<?php
}
add_action( 'wp_footer', 'cookie_bar', 10 );