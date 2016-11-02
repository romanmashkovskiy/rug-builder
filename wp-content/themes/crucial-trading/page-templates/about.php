<?php
/**
 * Template Name: About
 *
 * Creates the animated interactive about page
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
get_header();

echo do_shortcode( '[logo-nav]' ); ?>

<div class="about">
		
		<h3 class="about__sidetitle side-title rotate">About Crucial Trading</h3>
		
		<div class="about__timeline" id="about-timeline">
			<h3 class="about__timeline__subtitle subtitle">Our Story</h3>
			<div class="about__timeline__top vertical-align">
				<h1 class="about__timeline__heading vertical-align">Our Story</h1>
				<a href="#" title="Our Story" class="about__timeline__btn">Read More</a>
			</div>
		</div>
		
		<div class="about__scroller" id="about-scroller">
			<h3 class="about__scroller__subtitle subtitle">Our Process</h3>
			<div class="about__scroller__top vertical-align">
				<h1 class="about__scroller__heading vertical-align">Our Process</h1>
				<a href="#" title="Our Process" class="about__scroller__btn">Read More</a>
			</div>
		</div>

		<!--<div class="about__timeline__content">
			timeline
		</div>-->

</div>

<?php get_footer();