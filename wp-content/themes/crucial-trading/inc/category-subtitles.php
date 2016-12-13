<?php

add_action( 'product_cat_edit_form_fields', 'category_subtitles' );

function category_subtitles( $tag ) {

	$term_id  = $tag->term_id;
	$cat_meta = get_option( "category_$term_id" );

	?>

	<tr class="form-field">
		<th scope="row" valign="top">
			<label for="Cat_meta[subtitle]"><?php _e('Subtitle'); ?></label>
		</th>
		<td>
			<input type="text" name="Cat_meta[subtitle]" id="Cat_meta[subtitle]" size="3" style="width:60%;" value="<?php echo $cat_meta['subtitle'] ? $cat_meta['subtitle'] : ''; ?>">
			<br />
			<span class="description"><?php _e('Category Subtitle'); ?></span>
		</td>
	</tr>

	<?php
}

add_action( 'edit_product_cat', 'save_subtitle' );

function save_subtitle( $term_id ) {

	if ( isset( $_POST['Cat_meta'] ) ) {

		$cat_meta = get_option( "category_$term_id");
		$cat_keys = array_keys($_POST['Cat_meta']);

		foreach ( $cat_keys as $key ) {
			if ( isset( $_POST['Cat_meta'][$key] ) ) {
				$cat_meta[$key] = $_POST['Cat_meta'][$key];
			}
		}

		update_option( "category_$term_id", $cat_meta );
	}
}