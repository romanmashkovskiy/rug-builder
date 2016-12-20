<?php
/**
 * Template part for displaying results in search pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Crucial_Trading
 */

$news_title = get_the_title();
$news_date = get_the_date();
$news_cat = get_the_category();	
$news_excerpt = wp_trim_words( get_the_content(), 30, '...' );
$news_image = get_the_post_thumbnail( '', 'large');

$cat = '';

if ( is_array( $news_cat ) && count( $news_cat ) > 0 ) {
	$cat = $news_cat[0]->name;
}

?>

<article class="news__item" id="'.get_the_ID().'">
	<div class="news__item__category"><?php echo $cat; ?></div>
	<div class="news__item__category-line"></div>
	<a href="<?php echo get_the_permalink(); ?>" title="<?php echo $news_title; ?>" class="no-effect">
		<div class="news__item__box">
			<div class="news__item__contact-wrap">
				<div class="news__item__heading"><h2><?php echo $news_title; ?></h2></div>
				<div class="news__item__date"><?php echo $news_date; ?></div>
				<div class="news__item__excerpt"><?php echo $news_excerpt; ?></div>
				<!--<div class="news__item__link"><a href="<?php // echo get_the_permalink(); ?>" title="<?php // echo $news_title; ?>">Read More</a></div>-->
			</div>
			<div class="news__item__image-wrap">
				<div class="news__item__image">
						<?php echo $news_image; ?>
				</div>
			</div>
		</div>
	</a>
</article> 