<?php
/**
 * The large full size slider used on the homepage 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function crucial_super_slider($atts) {
	global $wpdb, $post;

	// Get shortcode attachments - in this case what kind of testimonial taxonomy should be shown
	$taxonomy_term = $atts['type'];

	$html = '<div class="testimonials clearfix">';
	
	$args=array(
	  'taxonomy' => 'testimonial', // Get custom taxonomy type
	  'term' => $taxonomy_term, // Shortcode Terms
	  'post_type' => 'super-slider',
	  'post_status' => 'publish',
	  //'posts_per_page' => 3,
	  'orderby' => 'menu_order',
	);
	
	$the_query = new WP_Query($args);
	while ( $the_query->have_posts() ) : $the_query->the_post();

			$date = get_the_date('l dS F Y');
			$custom = get_post_custom();
			$name = $custom['person'][0];
			$rating = $custom['rating'][0];
			$text = $custom['text'][0];

			$stars = '';
			for ( $i2=0; $i2<$rating; $i2++ ) {
				$stars .= '<i class="fa fa-star"></i>';
			}

			$html .= '<div class="col-md-4 testimonial retain-padding">';
			$html .= '<p class="testimonial__name">' . $name. '</p>';
			$html .= '<p class="testimonial__date">' . $date . '</p>';
			$html .= '<p class="testimonial__stars">' . $stars . '</p>';
			$html .= '<p class="testimonial__text">' . $text . '</p>';
			$html .= '</div>';

	endwhile;
	wp_reset_postdata(); // Reset post data so that the main template loop continues to work

	$html .= '</div>';

	return $html;
}

// Add shortcode

//add_shortcode('testimonials', 'testimonials_shortcode');