<?php

// Add Subtitle

add_action( 'product_cat_edit_form_fields', 'category_subtitles' );

function category_subtitles( $tag ) {

	$term_id  = $tag->term_id;
	$cat_meta = get_option( "category_$term_id" );

	?>

	<!-- Subtitle -->

	<tr class="form-field">
		<th scope="row" valign="top">
			<label for="Cat_meta[subtitle]"><?php _e('Subtitle'); ?></label>
		</th>
		<td>
			<input type="text" name="Cat_meta[subtitle]" id="Cat_meta[subtitle]" size="3" style="width:60%;" value="<?php echo is_array( $cat_meta ) && array_key_exists( 'subtitle', $cat_meta ) ? $cat_meta['subtitle'] : ''; ?>">
			<br />
			<span class="description"><?php _e('Category Subtitle'); ?></span>
		</td>
	</tr>

	<!-- Short Description -->

	<tr class="form-field">
		<th scope="row" valign="top">
			<label for="Cat_meta[short_desc]"><?php _e('Short Description'); ?></label>
		</th>
		<td>
			<input type="text" name="Cat_meta[short_desc]" id="Cat_meta[short_desc]" size="3" style="width:60%;" value="<?php echo is_array( $cat_meta ) && array_key_exists( 'short_desc', $cat_meta ) ? $cat_meta['short_desc'] : ''; ?>">
			<br />
			<span class="description"><?php _e('Category Short Description'); ?></span>
		</td>
	</tr>

	<!-- Menu Order -->

	<tr class="form-field">
		<th scope="row" valign="top">
			<label for="Cat_meta[menu_order]"><?php _e('Menu Order'); ?></label>
		</th>
		<td>
			<input type="text" name="Cat_meta[menu_order]" id="Cat_meta[menu_order]" size="3" style="width:60%;" value="<?php echo is_array( $cat_meta ) && array_key_exists( 'menu_order', $cat_meta ) ? $cat_meta['menu_order'] : ''; ?>">
			<br />
			<span class="description"><?php _e('Category Menu Order'); ?></span>
		</td>
	</tr>

	<!-- Background Image -->

	<tr class="form-field">
		<th scope="row" valign="top">
			<label for="Cat_meta[bg_image]"><?php _e('Background Image'); ?></label>
		</th>
		

		<td>
			<div id="product_cat_bg_image" style="float: left; margin-right: 10px;">
				<?php
				$img_id = is_array( $cat_meta ) && array_key_exists( 'bg_image', $cat_meta ) ? $cat_meta['bg_image'] : 0;
				$img    = wp_get_attachment_image_src( $img_id, array( 60, 60 ) )[0];
				?>
				<img src="<?php echo $img; ?>" width="60" height="60">
			</div>

			<div style="line-height: 60px;">
				<input type="hidden" id="bg_image_input" name="Cat_meta[bg_image]" value="<?php echo is_array( $cat_meta ) && array_key_exists( 'bg_image', $cat_meta ) ? $cat_meta['bg_image'] : 0; ?>">
				<button type="button" class="upload_bg_image_button button">Upload/Add image</button>
				<button type="button" class="remove_bg_image_button button">Remove image</button>
			</div>

			<script type="text/javascript">

			// Only show the "remove image" button when needed
			if ( '0' === jQuery( '#bg_image_input' ).val() ) {
				jQuery( '.remove_bg_image_button' ).hide();
			}

			// Uploading files
			var file_frame;

			jQuery( document ).on( 'click', '.upload_bg_image_button', function( event ) {

				event.preventDefault();

				// If the media frame already exists, reopen it.
				if ( file_frame ) {
					file_frame.open();
					return;
				}

				// Create the media frame.
				file_frame = wp.media.frames.downloadable_file = wp.media({
					title: 'Choose an image',
					button: {
						text: 'Use image'
					},
					multiple: false
				});

				// When an image is selected, run a callback.
				file_frame.on( 'select', function() {
					var attachment = file_frame.state().get( 'selection' ).first().toJSON();

					jQuery( '#bg_image_input' ).val( attachment.id );
					jQuery( '#product_cat_bg_image' ).find( 'img' ).attr( 'src', attachment.sizes.thumbnail.url );
					jQuery( '.remove_bg_image_button' ).show();
				});

				// Finally, open the modal.
				file_frame.open();
			});

			jQuery( document ).on( 'click', '.remove_bg_image_button', function() {
				jQuery( '#product_cat_bg_image' ).find( 'img' ).attr( 'src', 'http://localhost:8888/crucial-trading/wp-content/plugins/woocommerce/assets/images/placeholder.png' );
				jQuery( '#bg_image_input' ).val( '' );
				jQuery( '.remove_bg_image_button' ).hide();
				return false;
			});

			</script>
			<div class="clear"></div>
		</td>
	</tr>

		<!-- 3D Image -->

		<tr class="form-field">
		<th scope="row" valign="top">
			<label for="Cat_meta[3d_image]"><?php _e('3D Image'); ?></label>
		</th>
		

		<td>
			<div id="product_cat_3d_image" style="float: left; margin-right: 10px;">
				<?php
				$img_id = is_array( $cat_meta ) && array_key_exists( '3d_image', $cat_meta ) ? $cat_meta['3d_image'] : 0;
				$img    = wp_get_attachment_image_src( $img_id, array( 60, 60 ) )[0];
				?>
				<img src="<?php echo $img; ?>" width="60" height="60">
			</div>

			<div style="line-height: 60px;">
				<input type="hidden" id="3d_image_input" name="Cat_meta[3d_image]" value="<?php echo is_array( $cat_meta ) && array_key_exists( '3d_image', $cat_meta ) ? $cat_meta['3d_image'] : 0; ?>">
				<button type="button" class="upload_3d_image_button button">Upload/Add image</button>
				<button type="button" class="remove_3d_image_button button">Remove image</button>
			</div>

			<script type="text/javascript">

			// Only show the "remove image" button when needed
			if ( '0' === jQuery( '#3d_image_input' ).val() ) {
				jQuery( '.remove_3d_image_button' ).hide();
			}

			// Uploading files
			var file_frame;

			jQuery( document ).on( 'click', '.upload_3d_image_button', function( event ) {

				event.preventDefault();

				// If the media frame already exists, reopen it.
				if ( file_frame ) {
					file_frame.open();
					return;
				}

				// Create the media frame.
				file_frame = wp.media.frames.downloadable_file = wp.media({
					title: 'Choose an image',
					button: {
						text: 'Use image'
					},
					multiple: false
				});

				// When an image is selected, run a callback.
				file_frame.on( 'select', function() {
					var attachment = file_frame.state().get( 'selection' ).first().toJSON();

					jQuery( '#3d_image_input' ).val( attachment.id );
					jQuery( '#product_cat_3d_image' ).find( 'img' ).attr( 'src', attachment.sizes.thumbnail.url );
					jQuery( '.remove_3d_image_button' ).show();
				});

				// Finally, open the modal.
				file_frame.open();
			});

			jQuery( document ).on( 'click', '.remove_3d_image_button', function() {
				jQuery( '#product_cat_3d_image' ).find( 'img' ).attr( 'src', 'http://localhost:8888/crucial-trading/wp-content/plugins/woocommerce/assets/images/placeholder.png' );
				jQuery( '#3d_image_input' ).val( '' );
				jQuery( '.remove_3d_image_button' ).hide();
				return false;
			});

			</script>
			<div class="clear"></div>
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