<?php

/**
 * Template Name: Start RugBuilder
 *
 * The start rugbuilder page template
 *
 * @package Crucial Trading
 * @since Crucial 1.0
 */

get_header();

echo do_shortcode( '[logo-nav]' );

?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<div id="hello">
	<div class="vertical-align">
		<img src="https://d105txpzekqrfa.cloudfront.net/uploads/20161213142159/rug-builder-white-icon.svg" class="logo" alt="Rug Builder">
		<div class="hello__content">
			<h3><?php echo get_post_meta(get_the_ID(), 'subtitle', true); ?></h3>
			<h1>Rug Builder</h1>
			<p><?php the_content(); ?></p>
			<a href="<?php echo site_url(); ?>/rugbuilder" class="start">Start Building</a>
		</div>
		<h3 class="name"><?php echo get_post_meta(get_the_ID(), 'subtitle', true); ?></h3>
	</div>
</div>

<?php endwhile; endif; ?>

<?php

get_footer();
