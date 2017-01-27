<?php

function get_insta() {

	$insta_id     = '3184970245';
	$access_token = '3184970245.bbce2d9.27684c9edc1644a8adab70a0f7789f8c';

	$ch = curl_init();

	curl_setopt( $ch, CURLOPT_URL, "https://api.instagram.com/v1/users/$insta_id/media/recent/?access_token=$access_token&count=5" );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );

	$response = curl_exec( $ch );

	curl_close( $ch );

	return json_decode( $response )->data;

}

function extract_instagram_image( $post ) {

	$images = isset( $post->images ) ? $post->images : false;

	if ( !$images ) {
		return false;
	}

	if ( isset( $images->standard_resolution ) && isset( $images->standard_resolution->url ) ) {
		return $images->standard_resolution->url;
	}

	if ( isset( $images->low_resolution ) && isset( $images->low_resolution->url ) ) {
		return $images->low_resolution->url;
	}

	if ( isset( $images->thumbnail ) && isset( $images->thumbnail->url ) ) {
		return $images->thumbnail->url;
	}

	return false;

}

function extract_instagram_link( $post ) {

	return isset( $post->link ) ? $post->link : false;

}
