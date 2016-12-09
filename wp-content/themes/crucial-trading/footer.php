<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Crucial_Trading
 */

?>

			<?php echo do_shortcode( '[footer]' ); ?>

			<div class="basketPopup box-shadow">
				<a href="#" id="close-basket-popup">Close</a>
				<p class="basketMessage"></p>
			</div>

			</div>
		</div>
		<?php wp_footer(); ?>
	</body>
</html>