<?php

/**
* Add a materials meta box to the range categories, allowing each range to be associated with a particular material
*
* Contents:
* Add Meta Box to Edit Page
* Save Data
*
* @package Crucial Trading
* @since Crucial Trading 1.0
*/

// Add Meta Box to Edit Page

function add_material_meta_box_to_range_categories( $term ) {

	$parent_id = $term->parent;
	$parent    = get_term( $parent_id, 'product_cat' );

	if ( $parent->slug != 'range-parent' ) {
		return;
	}
 
	$term_id   = $term->term_id;
	$term_meta = get_option( "taxonomy_$term_id" );
	$current_material = is_array( $term_meta ) && array_key_exists( 'material', $term_meta ) ? $term_meta['material'] : '';

	$material_parent_id = (int)get_term_by( 'slug', 'material-parent', 'product_cat' )->term_id;

	$materials = get_terms( array(
		'taxonomy'   => 'product_cat',
		'parent'     => $material_parent_id,
		'hide_empty' => false,
	) );

	?>
	
	<tr class="form-field">
	<th scope="row" valign="top">
		<label for="term_meta[material]">Material</label>
	</th>
	<td>
		<select name="term_meta[material]" id="term_meta[material]">
			<?php

			for ( $i = 0; $i < count($materials); $i++ ) {
				$selected = $materials[$i]->slug == $current_material ? 'selected' : '';
				echo $selected;
				?>
				<option value="<?php echo $materials[$i]->slug; ?>" <?php echo $selected; ?>><?php echo $materials[$i]->name; ?></option>
				<?
			}
			?>
		</select>
		<p class="description">Select the material this range of rugs uses.</p>
	</td>
	</tr>

	<?php
}

add_action( 'product_cat_edit_form_fields', 'add_material_meta_box_to_range_categories', 10, 2 );

// Save Data

function save_taxonomy_custom_meta( $term_id ) {

	if ( isset( $_POST['term_meta'] ) ) {

		$term_meta = get_option( "taxonomy_$term_id" );
		$cat_keys  = array_keys( $_POST['term_meta'] );

		foreach ( $cat_keys as $key ) {

			if ( isset ( $_POST['term_meta'][$key] ) ) {
				$term_meta[$key] = $_POST['term_meta'][$key];
			}
		}

		update_option( "taxonomy_$term_id", $term_meta );
	}
}  

add_action( 'edited_product_cat', 'save_taxonomy_custom_meta', 10, 2 );