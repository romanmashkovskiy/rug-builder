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

echo '</div>';

get_footer();

echo do_shortcode( '[fts_twitter twitter_name=crucialtrading tweets_count=1 show_retweets=yes]' );