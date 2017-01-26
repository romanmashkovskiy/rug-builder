<?php

require get_template_directory() . '/vendor/twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

function get_twitter() {

	$connection = new TwitterOAuth(
		'SVnNqgxRICse5vMWp3oPMXd6g',
		'LBLJhBBQ5iQAVjhRQKcmZXD9MAZWHphtzJcNyvV2iWDg4UStPr',
		'2208956720-b36xp1azpR1pUg37z7Tx6PadcAOBNQNFiBuVtdf',
		'gtqSCpYlWuBW9V7sFAp3KLAKRYmFbCw8haa9COKQACTBS'
	);

	return $connection->get( 'statuses/user_timeline', [ 'count' => 5, 'include_entities' => 'true', 'tweet_mode' => 'extended' ] );

}

function extract_twitter_image( $post ) {

	$entities = isset( $post->entities ) ? $post->entities : false;
	$media    = $entities && isset( $entities->media ) ? $entities->media : false;

	if ( $media ) {

		if ( is_array( $media ) && count( $media ) > 0 ) {

			$image = $media[0]->media_url_https;

			return $image;

		}

	} else {

		$retweet    = isset( $post->retweeted_status ) ? $post->retweeted_status : false;
		$r_entities = $retweet && isset( $retweet->entities ) ? $retweet->entities : false;
		$r_media    = $r_entities && isset( $r_entities->media ) ? $r_entities->media : false;

		if ( !$r_media ) {
			return '';
		}

		if ( is_array( $r_media ) && count( $r_media ) > 0 ) {

			$r_image = $r_media[0]->media_url_https;

			return $r_image;

		}

	}

}