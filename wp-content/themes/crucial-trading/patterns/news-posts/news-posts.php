<?php
/**
 * Pattern: News Category Picker
 * The contact page form
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
 function news_posts( $atts = '' ) {

	wp_reset_postdata();

	$html = '';
	
	$news_posts = new WP_Query( array( 'post_type' => 'post' ) );
	
	$html .= '<div class="news-posts">';
		 
		// The Loop 
		while ( $news_posts->have_posts() ) : $news_posts->the_post();
			
			// Get post data
			$news_title = get_the_title();
			$news_date = get_the_date();
			$news_cat = '';
			$news_excerpt = get_the_excerpt();
			
			// Build article card
			$html .= '<article class="news__item" id="'.get_the_ID().'">
					<div class="news__item__category">'.$news_cat.'</div>
					<div class="news__item__box">
						<div class="news__item__contact-wrap">
							<div class="news__item__heading"><h3>'.$news_title.'</h3></div>
							<div class="news__item__date">'.$news_date.'</div>
							<div class="news__item__excerpt">'.$news_excerpt.'</div>
							<div class="news__item__link"><a href="'.get_the_permalink().'" title="'.$news_title.'">'.$news_title.'</a></div>
						</div>
						<div class="news__item__image-wrap">
							<div class="news__item__image">
								$news-image 
							</div>
						</div>
					</div>
				</article>';

		endwhile;

	$html .= '</div>';

	return $html;
}

add_shortcode( 'news-posts', 'news_posts' );