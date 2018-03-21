<?php
/**
 * Template Name: RugBuilder Hospitality
 *
 * The rugbuilder page template
 *
 * @package Crucial Trading
 * @since Crucial 1.0
 */

 if ( ! is_user_logged_in() && ! current_user_can( 'administrator' ) && ! current_user_can( 'editor' ) && ! current_user_can( 'hospitality' ) ) {
 	//header( 'Location: ' . site_url() . '/hospitality-register' );
	wp_redirect( ''.site_url().'/hospitality-register' );
 }

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading - Hospitality Builder</title>

  <style type="text/css">
  .box {
    width: 200px;
    height: 200px;
    margin-right: 20px;
    float: left;
  }

  /* #box {
    background: red;
  }

  #box2 {
    background: blue;
  }

  #box3 {
    background: green;
  } */
</style>

</head>
<body>
	<div id="root"> </div>

  <!-- <div id="box" class="box"></div>
  <div id="box2" class="box"></div>
  <div id="box3" class="box"></div> -->

	<?
		$domain = $_SERVER['SERVER_NAME'];
		$rh_path = '/wp-content/themes/crucial-trading/rugbuilder-hospitality';
		$loader_script_url = '';
		$css_url = '';

		/* DEV */
		if (
			$domain === 'localhost' ||
			$domain === 'vps.89hosting.co.uk'
		) {
			$loader_script_url = site_url() . $rh_path . '/dist/';
		}

		/* PRODUCTION & WIDGET */
		else {
			$loader_script_url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/v2/dist/';
		}
	?>

	<script src="<?php echo $loader_script_url ?>hospitality-loader.js"></script>
	<script>

		load({
			key               : 'E9(]8x~QGIZR^-f',
			secret            : 's+yflX{Nhev3iCeg@>wgPco5}2CMS6',
			showSubmitButton  : true,
			showRestartButton : true,
			showExitButton    : true
		})

	</script>


    <script src="https://code.jquery.com/jquery-3.3.1.js"
      integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
      crossorigin="anonymous"
    >
    </script>

  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
    integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
    crossorigin="anonymous"
  >
  </script>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.11.0/css/bootstrap-tour-standalone.css" />



  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.11.0/js/bootstrap-tour.js"></script>




  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/joyride/2.1.0/joyride.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/joyride/2.1.0/jquery.joyride.js"></script>
</body>
</html>
