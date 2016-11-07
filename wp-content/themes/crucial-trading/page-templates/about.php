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
		</div>
		
		<div class="about__scroller" id="about-scroller">
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
				
			<div class="timeline__event" id="one" 
					data-0="transform: translate(0,0%);opacity: 0.5;" 
					data-500="transform: translate(0,10%);opacity: 1;" 
					data-1000="transform: translate(0,20%);"
					data-2000="transform: translate(0,55%);"	
					>
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">1999.</span> Where It Started</h4>
				<div class="timeline__event__img"	
					data-100="transform: translate(0,-300px);opacity: 0.1;" 
					data-400="transform: translate(0,-200px);opacity: 0.3;" 
					data-600="transform: translate(0,-100px);opacity: 0.6;" 
					data-800="transform: translate(0,0);opacity: 0.8;" 
					data-1000="transform: translate(0,0px);opacity:1;"
							><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>
		
			<div class="timeline__event" id="two">
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">2010.</span> Where It Started</h4>
				<div class="timeline__event__img"><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>

		
			<div class="timeline__event" id="three">
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">1999.</span> Where It Started</h4>
				<div class="timeline__event__img"><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>
		
			<div class="timeline__event" id="four">
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">1999.</span> Where It Started</h4>
				<div class="timeline__event__img"><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>

		</div>
		
</div>

<?php get_footer();