<?php
/**
 * Email Header
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-header.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates/Emails
 * @version 2.4.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<!DOCTYPE html>
<html dir="<?php echo is_rtl() ? 'rtl' : 'ltr'?>">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
		<title><?php echo get_bloginfo( 'name', 'display' ); ?></title>
		<link href="https://fonts.googleapis.com/css?family=Open+Sans|Playfair+Display" rel="stylesheet">
		<style>
			h1, h2, h3, h4, h5, h6 {
				font-family: 'Playfair Display', serif;
			}
			p, td, div {
				font-family: 'Open Sans', sans-serif;
			}
		</style>
	</head>
	<body <?php echo is_rtl() ? 'rightmargin' : 'leftmargin'; ?>="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
		<div id="wrapper" dir="<?php echo is_rtl() ? 'rtl' : 'ltr'?>" style="background-color: #383838;
    border-radius: 3px 3px 0 0 !important;
    color: #ffffff;
    border-bottom: 0;
    font-weight: bold;
    line-height: 100%;
    vertical-align: middle;
    font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;">
			<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
				<tr>
					<td align="center" valign="top">
						<div id="template_header_image">
							<p style="margin-top:0;text-align:center;"><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/26174004/logo.svg" alt="Crucial Trading"/></p>
						</div>
						<table border="0" cellpadding="0" cellspacing="0" width="600">
							<tr>
								<td align="center" valign="top">
										<tr style="background:#383838;">
											<td id="header_wrapper">
												<h1 style="font-size:52px;text-align:center;color:#ffffff;">
													<?php

													$heading = '';

													switch ( $email_heading ) {

														case 'Welcome to Crucial Trading' :
															$heading = 'Account Registered';
															break;

														case 'Your order is complete' :
															$heading = 'Order Complete';
															break;

														case 'Thank you for your order' :
															$heading = 'Order Received';
															break;

														default :
															$heading = $email_heading;
															break;
													}

													echo $heading; 
													?>
												</h1>
											</td>
										</tr>
									<!-- End Header -->
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>



									<!-- Body -->
									<table border="0" cellpadding="0" cellspacing="0" width="600" id="template_body" style="width:100%;">
										<tr style="width:100%;">
											<td valign="top" id="body_content" style="width:100%;">
												<!-- Content -->
												<table border="0" cellpadding="20" cellspacing="0" width="100%" style="width:100%;">
													<tr style="width:100%;">
														<td valign="top" style="width:100%;">
															<div id="body_content_inner" style="width:100%;" style="padding:25px;">
