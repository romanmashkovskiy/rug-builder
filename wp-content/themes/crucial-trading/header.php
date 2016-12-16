<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Crucial_Trading
 */

$header_class = WC()->cart->get_cart_contents_count() == 0 ? 'basket-empty' : 'basket-full';

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="profile" href="http://gmpg.org/xfn/11">
		<?php wp_head(); ?>
		<script>var siteURL = '<?php echo site_url(); ?>';</script>
	</head>
	<body <?php body_class( $header_class ); ?>>
		<div id="page" class="site">
			<main id="content" class="site-content">