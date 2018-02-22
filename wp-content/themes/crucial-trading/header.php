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
		<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="google-site-verification" content="frbcypQV4caMUho2FkpvOasdks8mHtic44EeduDBdqM" />
		<link rel="profile" href="http://gmpg.org/xfn/11">
		<?php include get_template_directory() . '/header-partials/modernizr.php'; ?>
		<?php wp_head(); ?>
		<!--[if lt IE 9]>
		<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.js"></script>
		<![endif]-->
    <script type="text/javascript">
      var templateUrl = '<?= get_bloginfo("template_url"); ?>';
    </script>
		<script>
				(function(h,o,t,j,a,r){
						h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
						h._hjSettings={hjid:568420,hjsv:5};
						a=o.getElementsByTagName('head')[0];
						r=o.createElement('script');r.async=1;
						r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
						a.appendChild(r);
				})(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
		</script>
		<link href="<?php echo get_template_directory_uri(); ?>/assets/css/dist/ie9.min.css" rel="stylesheet" type="text/css" media="all">
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	</head>
	<body <?php body_class( $header_class ); ?>>
		<?php //wc_print_notices(); ?>
		<div id="page" class="site">
			<main id="content" class="site-content">
