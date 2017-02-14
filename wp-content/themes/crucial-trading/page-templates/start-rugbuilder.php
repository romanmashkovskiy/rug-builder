<?php

/**
 * Template Name: Start RugBuilder
 *
 * The start rugbuilder page template
 *
 * @package Hogarths
 * @since Hogarths 1.0
 */

get_header();

echo do_shortcode( '[logo-nav]' );

?>

<div id="hello">
	<div class="vertical-align">
		<img src="http://d105txpzekqrfa.cloudfront.net/uploads/20161213142159/rug-builder-white-icon.svg" class="logo" alt="Rug Builder">
		<div class="hello__content">
			<h3>Build Your Own</h3>
			<h1>Rug Builder</h1>
			<p>With thousands of combination, our easy-to-use Rug Builder puts you in the shoes of the designer.</p>
			<a href="<?php echo site_url(); ?>/rugbuilder" class="start">Start Building</a>
		</div>
		<h3 class="name">Rug Builder</h3>
	</div>
</div>

<?php

get_footer();