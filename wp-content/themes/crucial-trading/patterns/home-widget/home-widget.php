<?php

/**
 * Template Name: Logo Nav
 * The logo and mav that appear across the top of the site
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

require get_template_directory() . '/vendor/twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

function home_inspiration_widget( $atts = '' ) {

	$connection = new TwitterOAuth(
		'SVnNqgxRICse5vMWp3oPMXd6g',
		'LBLJhBBQ5iQAVjhRQKcmZXD9MAZWHphtzJcNyvV2iWDg4UStPr',
		'2208956720-b36xp1azpR1pUg37z7Tx6PadcAOBNQNFiBuVtdf',
		'gtqSCpYlWuBW9V7sFAp3KLAKRYmFbCw8haa9COKQACTBS'
	);

	$tweets = $connection->get( 'statuses/user_timeline', [ 'count' => 3, 'include_entities' => 'true', 'tweet_mode' => 'extended' ] );

	foreach ( $tweets as $key => $tweet ) {
		$tweet->created_time = strtotime( $tweet->created_at );
	}

	$image = get_image( $tweets );
	$tweet_image = $image[0];
	$tweet_index = $image[1];

	if ( $tweet_image ) {
		$tweet_text  = isset( $tweets[$tweet_index]->full_text ) ? substr( $tweets[$tweet_index]->full_text, 0, 75 ) . '...' : '';
		$tweet_time  = get_time( $tweets[$tweet_index] );
	}

	$html = '';

	$html .= '<div class="home-inspiration-widget clearfix">';

	if ( $tweet_image ) {
		$html .= '<div class="widget__image">';
		$html .= do_shortcode( '[social-post image="' . $tweet_image . '" title="' . $tweet_text . '" time="' . $tweet_time . '"]' );
		$html .= '</div>';
	}
	
	//$html .= do_shortcode( '[fts_twitter twitter_name=crucialtrading tweets_count=1 show_retweets=no]' );

	$html .= '<div class="widget__text">';
	$html .= '<h3>Social Satisfaction</h3>';
	$html .= '<h2>Get Inspired</h2>';
	$html .= '<span></span>';
	$html .= '<p>See how our unique products have been used as the centre of beautiful interior design</p>';
	$html .= '<a href="' . site_url() . '/inspiration">Get Inspired</a>';
	$html .= '</div>';

	$html .= '</div>';

	return $html;
}

add_shortcode( 'home-inspiration-widget', 'home_inspiration_widget' );

function get_image( $tweets ) {

	$i = 0;

	foreach ( $tweets as $key => $tweet ) {

		$entities = isset( $tweet->entities ) ? $tweet->entities : false;
		$media    = $entities && isset( $entities->media ) ? $entities->media : false;

		if ( $media ) {

			if ( is_array( $media ) && count( $media ) > 0 ) {
				return array( $media[0]->media_url_https, $i );
			}

		} else {

			$retweet    = isset( $tweet->retweeted_status ) ? $tweet->retweeted_status : false;
			$r_entities = $retweet && isset( $retweet->entities ) ? $retweet->entities : false;
			$r_media    = $r_entities && isset( $r_entities->media ) ? $r_entities->media : false;

			if ( !$r_media ) {
				$i++;
				continue;
			}

			if ( is_array( $r_media ) && count( $r_media ) > 0 ) {
				return array( $r_media[0]->media_url_https, $i );
			}

		}

	}

	return array( false, -1 );
}

function get_time( $tweet ) {

	$posted_unix = $tweet->created_time;
	$now_unix    = time();
	$difference  = $now_unix - $posted_unix;

	$mins_ago  = round( abs( $difference ) / 60 );
	$hours_ago = round( $mins_ago / 60 );
	$days_ago  = round( $hours_ago / 24 );

	if ( $days_ago > 0 ) {
		return  "$days_ago days ago";
	} else if ( $hours_ago > 0 ) {
		return  "$hours_ago hours ago";
	} else {
		return  "$mins_ago minutes ago";
	}

}