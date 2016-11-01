<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Crucial_Trading
 */

get_header();

echo do_shortcode( '[header]' );

echo do_shortcode( '[logo-nav]' );

?>

<main>
</main>

<?php get_footer();