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

	// Get category attachments
	if ( !empty($atts['category']) ) :
		$category = $atts['category'];
	else : 
		$category = ''; // Leave blank so that any new categories added can appear in News & Events loops
	endif;

	$html = '';
	
	// Tell wp what pages its on for pagination links
	$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
	
	// The Query
	$news_posts = new WP_Query( array(
	 'post_type' => 'post',
	 'posts_per_page' => 5,
	 'paged' => $paged,
	 'ignore_sticky_posts'    => true,
	 'category_name' => $category,
	 'ignore_sticky_posts'    => true,
		'no_found_rows'        => true
	 ) );
	
	$html .= '<div class="news-posts">';
		 
		// The Loop 
		while ( $news_posts->have_posts() ) : $news_posts->the_post();
			
			// Get post data
			$news_title = get_the_title();
			$news_date = get_the_date();
			$news_cat = get_the_category();	
			$news_excerpt = wp_trim_words( get_the_content(), 30, '...' );
			$news_image = get_the_post_thumbnail( '', 'large');
			
			// Build article card
			$html .= '<article class="news__item" id="'.get_the_ID().'">
					<div class="news__item__category">'.$news_cat[0]->name.'</div>
					<div class="news__item__category-line"></div>
					<a href="'.get_the_permalink().'" title="'.$news_title.'" class="no-effect">
						<div class="news__item__box">
							<div class="news__item__contact-wrap">
								<div class="news__item__heading"><h2>'.$news_title.'</h2></div>
								<div class="news__item__date">'.$news_date.'</div>
								<div class="news__item__excerpt">'.$news_excerpt.'</div>
								<!--<div class="news__item__link"><a href="'.get_the_permalink().'" title="'.$news_title.'">Read More</a></div>-->
							</div>
							<div class="news__item__image-wrap">
								<div class="news__item__image object-fit-container">
										'.$news_image.'
								</div>
							</div>
						</div>
					</a>
				</article>';

		endwhile;

	$html .= '</div>';
	
	wp_reset_postdata();
	
	return $html;
}

add_shortcode( 'news-posts', 'news_posts' );