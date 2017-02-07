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

		<?php // WEAKMAP POLYFILL ?>
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/vendor/modernizr.es6collections.min.js"></script>
		<script>
		if ( !Modernizr.es6collections ) {
			var scripts       = document.scripts;
			var scriptsLength = scripts.length;
			var thisScript    = scripts[scriptsLength - 1];
			var parent        = thisScript.parentElement;

			var polyfill = document.createElement('script');
			polyfill.src = '<?php echo get_template_directory_uri(); ?>/assets/js/vendor/WeakMap.js';

			parent.insertBefore(polyfill, thisScript.nextSibling);
		}
		</script>

		<?php // MUTATION OBSERVER POLYFILL ?>
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/vendor/modernizr.mutation-observer.min.js"></script>
		<script>
		if ( !Modernizr.mutationobserver ) {
			var scripts       = document.scripts;
			var scriptsLength = scripts.length;
			var thisScript    = scripts[scriptsLength - 1];
			var parent        = thisScript.parentElement;

			var polyfill = document.createElement('script');
			polyfill.src = '<?php echo get_template_directory_uri(); ?>/assets/js/vendor/MutationObserver.js';

			parent.insertBefore(polyfill, thisScript.nextSibling);
		}
		</script>

		<?php wp_head(); ?>
		<script>var siteURL = '<?php echo site_url(); ?>';</script>
		<!--[if lt IE 9]> 
		<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.js"></script>
		<![endif]-->
	</head>
	<body <?php body_class( $header_class ); ?>>
		<?php wc_print_notices(); ?>
		<div id="page" class="site">
			<main id="content" class="site-content">