<?php

/**
 * Template Name: Home Page News
 * The latest news seciton on the home page
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
 function home_page_news( $atts = '' ) {

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
	 'posts_per_page' => 1,
	 'paged' => $paged,
	 'category_name' => $category
	 ) );
	
	$html .= '<div class="news-posts home">';
	$html .= '<div class="news__title">';
	$html .= '<h3>Stay up to date</h3>';
	$html .= '<h2>Latest News</h2>';
	$html .= '</div>';
		 
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
								<div class="news__item__image">
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

add_shortcode( 'home-page-news', 'home_page_news' );

/*

function home_page_news( $atts = '' ) {

	$html = '';

	$query = wp_get_recent_posts( array( 'numberposts' => 1 ) );

	if ( count( $query ) == 0 ) {
		return $html;
	}

	$post = $query[0];

	$post_id       = $post['ID'];
	$post_title    = $post['post_title'];
	$post_excerpt  = wp_trim_words( $post['post_content'], 20, '...' );
	$post_date     = get_the_date( $post_id );
	$post_perma    = get_the_permalink( $post_id );
	$post_thumb    = get_the_post_thumbnail( $post_id, 'large' );
	$post_category = get_the_category( $post_id )[0]->name;

	$html .= '<div class="latest-news">';

	$html .= '<div class="news__title">';
	$html .= '<h3>Stay up to date</h3>';
	$html .= '<h2>Latest News</h2>';
	$html .= '</div>';

	$html .= '<div class="news__post clearfix">';
	$html .= '<div class="borderr">';

	$html .= '<h3 class="cat">' . $post_category . '</h3>';
	$html .= '<span class="line"></span>';
	
	$html .= '<div class="post__left">';
	$html .= '<h2>' . $post_title . '</h2>';
	$html .= '<h3>' . $post_date . '</h3>';
	$html .= '<p>' . $post_excerpt . '</p>';
	$html .= '<a href="' . $post_perma . '">Read More</a>';
	$html .= '</div>';

	$html .= '<div class="post__right">';
	$html .= $post_thumb;
	$html .= '</div>';

	$html .= '</div>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'home-page-news', 'home_page_news' );

*/