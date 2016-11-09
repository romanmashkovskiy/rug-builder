<?php
/**
 * Template Name: Inspiration
 *
 * The inspiration template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */
 
get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[share-links]' );

echo '<div class="posts">';

echo do_shortcode( '[fts_twitter twitter_name=crucialtrading tweets_count=2 show_retweets=yes]' );

echo do_shortcode( '[fts_instagram instagram_id=3184970245 pics_count=3 super_gallery=yes image_size=640px icon_size=65px space_between_photos=1px hide_date_likes_comments=yes center_container=no image_stack_animation=no type=user]' );

/*
echo '<div class="post" id="post-1">';
echo do_shortcode( '[social-post image="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24200959/organic-slide.jpg" title="Our new floor is so beautiful!" time="4 Days Ago" from="twitter"]' );
echo '</div>';

echo '<div class="post" id="post-2">';
echo do_shortcode( '[social-post image="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24193927/build-your-rug-image.jpg" from="instagram"]' );
echo '</div>';

echo '<div class="post" id="post-3">';
echo do_shortcode( '[social-post image="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24194511/about-crucial-home.jpeg" from="instagram"]' );
echo '</div>';

echo '<div class="post" id="post-4">';
echo do_shortcode( '[social-post image="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24200955/intense-slide.jpg" title="Loving the new rug!" time="6 Days Ago" from="twitter"]' );
echo '</div>';

echo '<div class="post" id="post-5">';
echo do_shortcode( '[social-post image="http://d105txpzekqrfa.cloudfront.net/uploads/2016/10/24200959/organic-slide.jpg" from="instagram"]' );
echo '</div>';
*/

echo '</div>';

get_footer();