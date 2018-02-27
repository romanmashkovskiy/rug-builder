<?php
/**
 * Template Name: Home
 *
 * The home page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

get_header();

echo do_shortcode( '[logo-nav]' );

?>

<h1 style="position: absolute; right: 200%;"> Natural Floorcoverings </h1>

<?php

echo do_shortcode( '[super-slider]' );

echo do_shortcode( '[section-boxes number=0]' );

echo do_shortcode( '[materials-slider]' );

echo do_shortcode( '[section-boxes number=1]' );

echo do_shortcode( '[home-inspiration-widget]' );

//echo do_shortcode( '[home-page-news]' );

echo do_shortcode( '[section-boxes number=2]' );

?> <div class="clearfix"> <?php

echo do_shortcode( '[home-page-cta id=1]' );

echo do_shortcode( '[home-page-cta id=2]' );

?> </div> <?php

get_footer();
