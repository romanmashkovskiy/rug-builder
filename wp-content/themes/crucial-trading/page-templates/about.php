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
					data-0="transform: translate(0,-400px);opacity: 0.3;" 
					data-500="transform: translate(0,-400px);opacity: 1;" 
					data-1000="transform: translate(0,-200px);"
					data-2000="transform: translate(0,900px);"
					data-2500="opacity: 0.3;"
					data-3000="opacity: 0;"
					>
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">1999.</span> Where It Started</h4>
				<div class="timeline__event__img"	
					
				><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>
		
			<div class="timeline__event" id="two"
					data-1000="transform: translate(0,400px);opacity: 0.4;" 
					data-1500="transform: translate(0,800px);opacity: 1;" 
					data-2000="transform: translate(0,850px);"
					data-3500="transform: translate(0,1700px);"
					data-3800="transform: translate(0,1800px);opacity: 0.4;"
					data-4300="opacity: 0;"		
				>
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">2010.</span> Where It Started</h4>
				<div class="timeline__event__img"
				><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>

		
			<!--<div class="timeline__event" id="three"
				data-1000="transform: translate(0,600px);opacity: 0;" 
				data-2000="transform: translate(0,1000px);opacity: 0.4;" 
				data-2500="transform: translate(0,1000px);opacity: 1;" 
				data-3000="transform: translate(0,1000px);"
				data-4000="transform: translate(0,1500px);"	
				data-4500="opacity: 0.5;"
				data-5000="opacity: 0;"	
				>
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">1999.</span> Where It Started</h4>
				<div class="timeline__event__img" 
				><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>
		
			<div class="timeline__event" id="four"
				data-3000="transform: translate(0,800px);opacity: 0.2;" 
				data-4000="transform: translate(0,2000px);opacity: 1;" 
				data-4500="transform: translate(0,65%);"
				data-5000="transform: translate(0,80%);"	
				data-6500="opacity: 0.5;"
				>
				<div class="timeline__event__line"><span class="timeline__event__ball"></span></div>
				<h4 class="timeline__event__heading"><span class="timeline__event__date">1999.</span> Where It Started</h4>
				<div class="timeline__event__img"><img src="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" alt="" /></div>
				<div class="timeline__event__description">
					<p>We cant improve on nature?s creations. But we can gather them together from all four corners and give them the respect they deserve by weaving them into something as beautiful and pure as the settings from which they came.</p>
				</div>
			</div>-->

		</div>
		
</div>

<?php get_footer();