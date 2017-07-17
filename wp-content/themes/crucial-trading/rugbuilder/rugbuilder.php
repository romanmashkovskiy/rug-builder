<?php
/**
 * Template Name: RugBuilder
 *
 * The rugbuilder page template
 *
 * @package Crucial
 * @since Crucial 1.0
 */

?>

<!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<title>Crucial Trading - Rug Builder</title>
	<style>body{margin:0}</style>
	<link rel="stylesheet" href="http://cdn.crucial-trading.com/rb/style.min.css">


	<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.0/es6-promise.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom-server.min.js"></script>

	<script src="http://cdn.crucial-trading.com/rb/three.js"> </script>
	<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/85/three.min.js"> </script> -->

	<script src="http://cdn.crucial-trading.com/rb/pubsub.min.js"> </script>
	<script src="http://cdn.crucial-trading.com/rb/orbitcontrols.min.js"> </script>

	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-6149929-1', 'auto');
	  ga('send', 'pageview');
	</script>
</head>
<body>

	<div id="background-div"></div>
	<div id="app">
		<div id="full-loading">
			<h1>Loading</h1>
			<div class="loader"></div>
		</div>
		<div id="progress-menu"></div>
		<div id="drawer"></div>
		<div id="view-controls"></div>
		<div id="price"></div>
		<div id="order-screen"></div>
		<div id="error-box">
			<p id="error-msg"></p>
			<p id="error-code"></p>
			<img src="https://d105txpzekqrfa.cloudfront.net/uploads/20170110133952/exit.svg" id="close-error">
		</div>
	</div>

	<script src="http://cdn.crucial-trading.com/rb/rugBuilder.min.js"> </script>
	<!-- <script src="http://localhost:8888/rugbuilder/assets/js/dist/rugBuilder.min.js"> </script> -->


	<script>
		var siteUrl = 'http://vps.89hosting.co.uk/~crucialtrading';

		if (!siteUrl) {
			var pathArray = location.href.split( '/' );
			var siteUrl = pathArray[0];
		}

		var exitPath = '/start-rugbuilder';
		var emailAddress = 'connorlloydmoore@codegood.co';
		var widget = false;

		if ( !Modernizr.promises ) {
			window.Promise = ES6Promise;
		}

		var rugBuilder = new RugBuilder('website');
		rugBuilder.start();
	</script>
</body>
</html>
