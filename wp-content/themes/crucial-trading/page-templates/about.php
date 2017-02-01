<?php
/**
 * Template Name: About
 *
 * Creates the animated interactive about page
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[logo-nav]' ); ?>

<div class="about">
		
		<h3 class="about__sidetitle side-title rotate">About Crucial Trading</h3>
		<a href="#" title="Back to Start" class="about__timeline__btn about__timeline__btn--close">Back to Start</a>
		<a href="#" title="Back to Start" class="about__scroller__btn about__scroller__btn--close">Back to Start</a>
		
		<div class="about__timeline" id="about-timeline">
			<div class="about__timeline__bg"></div>
			<div class="timeline__top-line"><div class="timeline__top-line timeline__top-line--horizontal"></div></div>
			<h3 class="about__timeline__subtitle subtitle">Our Story</h3>
			<div class="about__timeline__text vertical-align">
				<h1 class="about__timeline__heading vertical-align">Our Story</h1>
				<a href="#" title="Our Story" class="about__timeline__btn">Read More</a>
			</div>
		</div><div class="about__scroller" id="about-scroller">
			<div class="about__scroller__bg"></div>
			<div class="about__scroller__btn--close">Back to Start</div>
			<h3 class="about__scroller__subtitle subtitle">Our Process</h3>
			<div class="about__scroller__text vertical-align">
				<h1 class="about__scroller__heading vertical-align">Our Process</h1>
				<a href="#" title="Our Process" class="about__scroller__btn">Read More</a>
			</div>
		</div>
		
				
		<div class="about__timeline__content clearfix">
			
			<div class="timeline__centre-line"></div>

			<?php

			$args = array(
				'post_type' => 'timeline',
				'orderby'   => 'menu_order',
				'order'     => 'ASC',
			);

			$query = new WP_Query( $args );

			if ( $query->have_posts() ) {

				foreach ( $query->posts as $key => $post ) {

					$post_id = $post->ID;
					$year    = rwmb_meta( 'timeline-year', array(), $post_id );
					$title   = rwmb_meta( 'timeline-title', array(), $post_id );
					$content = rwmb_meta( 'timeline-content', array(), $post_id );

					?>

					<div class="timeline__event" data-500="transform: translate(0,-400px);opacity: 1;" data-1000="transform: translate(0,-200px);" data-2000="transform: translate(0,900px);" data-2500="opacity: 0.3;" data-3000="opacity: 0;">
						<div class="timeline__event__line">
							<span class="timeline__event__ball"></span>
						</div>
						<h4 class="timeline__event__heading">
							<span class="timeline__event__date"><?php echo $year; ?>.</span> <?php echo $title; ?>
						</h4>
						<div class="timeline__event__large-date">
							<span class="timeline__event__large-date--lg"><?php echo $year; ?>.</span>
						</div>
						<div class="timeline__event__description">
							<p><?php echo $content; ?></p>
						</div>
					</div>

					<?php

				}

			}

			?>

		</div>
		
		<div class="about__scroller__content clearfix">
			
			

		</div>

		
</div>

<?php get_footer();