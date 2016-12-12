<?php
/**
 * Template Name: Inspiration
 *
 * The inspiration template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[share-links]' );

echo '<div class="posts">';

echo do_shortcode( '[fts_twitter twitter_name=crucialtrading tweets_count=2 show_retweets=yes]' );

echo do_shortcode( '[fts_instagram instagram_id=3184970245 pics_count=3 super_gallery=yes image_size=640px icon_size=65px space_between_photos=1px hide_date_likes_comments=yes center_container=no image_stack_animation=no type=user]' );

echo '</div>';

echo do_shortcode( '[newsletter-signup]' );

get_footer();