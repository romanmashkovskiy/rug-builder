<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Crucial_Trading
 */

get_header();

echo do_shortcode( '[logo-nav]' );

?>

<header class="small">
	<div class="header__text vertical-align">
		<h3 class="side-title">Error 404</h3>
		<h1>Oops! That page can&rsquo;t be found</h1>
	</div>
</header>
	
<div class="single-post__container box-shadow">
			
	<div class="page-content ">
		<p><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'crucial-trading' ); ?></p>
		<?php get_search_form(); ?>
	</div>

</div>
	
<?php get_footer();