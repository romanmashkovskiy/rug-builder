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

session_start();

$header_class = WC()->cart->get_cart_contents_count() == 0 ? 'basket-empty' : 'basket-full';

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="profile" href="http://gmpg.org/xfn/11">
		<?php include get_template_directory() . '/header-partials/modernizr.php'; ?>
		<?php wp_head(); ?>
		<?php include get_template_directory() . '/header-partials/lt-ie9.php'; ?>
		<?php include get_template_directory() . '/header-partials/ie9-css.php'; ?>
	</head>
	<body <?php body_class( $header_class ); ?>>
		<?php wc_print_notices(); ?>
		<div id="page" class="site">
			<main id="content" class="site-content">