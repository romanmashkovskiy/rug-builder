<?php
    $gdpr_default_content = new Moove_GDPR_Content();
    $option_name    = $gdpr_default_content->moove_gdpr_get_option_name();
    $gdpr_options   = get_option( $option_name );
    $wpml_lang      = $gdpr_default_content->moove_gdpr_get_wpml_lang();
    $gdpr_options   = is_array( $gdpr_options ) ? $gdpr_options : array();
    if ( isset( $_POST ) && isset( $_POST['moove_gdpr_nonce'] ) ) :
        $nonce = sanitize_key( $_POST['moove_gdpr_nonce'] );
        if ( ! wp_verify_nonce( $nonce, 'moove_gdpr_nonce_field' ) ) :
            die( 'Security check' );
        else :
            if ( is_array( $_POST ) ) :
                if ( isset( $_POST['moove_gdpr_floating_button_enable'] ) ) :
                    $value  = 1;
                else :
                    $value  = 0;
                endif;
                $gdpr_options['moove_gdpr_floating_button_enable'] = $value;
                update_option( $option_name, $gdpr_options );
                $gdpr_options = get_option( $option_name );
                foreach ( $_POST as $form_key => $form_value ) :
                    if ( $form_key === 'moove_gdpr_info_bar_content' ) :
                        $value  = wpautop( wp_unslash( $form_value ) );
                        $gdpr_options[$form_key.$wpml_lang] = $value;
                        update_option( $option_name, $gdpr_options );
                        $gdpr_options = get_option( $option_name );
                    elseif ( $form_key === 'moove_gdpr_modal_strictly_secondary_notice' . $wpml_lang ) :
                        $value  = wpautop( wp_unslash( $form_value ) );
                        $gdpr_options[$form_key.$wpml_lang] = $value;
                        update_option( $option_name, $gdpr_options );
                        $gdpr_options = get_option( $option_name );
                    elseif ( $form_key !== 'moove_gdpr_floating_button_enable' ) :
                        $value  = sanitize_text_field( $form_value );
                        $gdpr_options[$form_key] = $value;
                        update_option( $option_name, $gdpr_options );
                        $gdpr_options = get_option( $option_name );
                    endif;
                endforeach;
            endif;
            ?>
                <script>
                    jQuery('#moove-gdpr-setting-error-settings_updated').show();
                </script>
            <?php
        endif;
    endif;
?>
<br />
<form action="?page=moove-gdpr&amp;tab=general_settings" method="post" id="moove_gdpr_tab_general_settings">
    <h2><?php _e('Modal General Settings','moove-gdpr'); ?></h2>
    <hr />
    <?php wp_nonce_field( 'moove_gdpr_nonce_field', 'moove_gdpr_nonce' ); ?>
    <table class="form-table">
        <tbody>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_brand_colour"><?php _e('Brand Primary Colour','moove-gdpr'); ?></label>
                </th>
                <td>
                    <div class="iris-colorpicker-group-cnt">
                        <?php $color = isset( $gdpr_options['moove_gdpr_brand_colour'] ) && $gdpr_options['moove_gdpr_brand_colour'] ? $gdpr_options['moove_gdpr_brand_colour'] : '0C4DA2'; ?>
                        <input class="iris-colorpicker regular-text" name="moove_gdpr_brand_colour" value="<?php echo $color; ?>" style="background-color: <?php echo $color; ?>" type="text">
                        <span class="iris-selectbtn"><?php _e('Select','moove-gdpr'); ?></span>
                    </div>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_brand_secondary_colour"><?php _e('Brand Secondary Colour','moove-gdpr'); ?></label>
                </th>
                <td>
                    <div class="iris-colorpicker-group-cnt">
                        <?php $color =  isset( $gdpr_options['moove_gdpr_brand_secondary_colour'] ) && $gdpr_options['moove_gdpr_brand_secondary_colour'] ? $gdpr_options['moove_gdpr_brand_secondary_colour'] : '000000'; ?>
                        <input class="iris-colorpicker regular-text" name="moove_gdpr_brand_secondary_colour" value="<?php echo $color; ?>" style="background-color: <?php echo $color; ?>" >
                        <span class="iris-selectbtn"><?php _e('Select','moove-gdpr'); ?></span>
                    </div>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_company_logo"><?php _e('Modal Logo','moove-gdpr'); ?></label>
                    <p class="description"><?php _e('Recommended size:','moove-gdpr'); ?><br>130 x 50 <?php _e('pixels','moove-gdpr'); ?></p>
                    <!--  .description -->
                </th>
                <td>
                    <?php
                        if ( function_exists( 'wp_enqueue_media' ) ) :
                            wp_enqueue_media();
                        else:
                            wp_enqueue_style('thickbox');
                            wp_enqueue_script('media-upload');
                            wp_enqueue_script('thickbox');
                        endif;
                    ?>
                    <?php
                    $plugin_dir = moove_gdpr_get_plugin_directory_url();
                    $image_url = isset( $gdpr_options['moove_gdpr_company_logo'] ) && $gdpr_options['moove_gdpr_company_logo'] ? $gdpr_options['moove_gdpr_company_logo'] : $plugin_dir.'dist/images/moove-logo.png';
                    ?>
                    <span class="moove_gdpr_company_logo_holder" style="background-image: url(<?php echo $image_url; ?>);"></span><br /><br />
                    <input class="regular-text code" type="text" name="moove_gdpr_company_logo" value="<?php echo $image_url; ?>" required> <br /><br />
                    <a href="#" class="button moove_gdpr_company_logo_upload">Upload Logo</a>
                    <script>
                        jQuery(document).ready(function($) {
                            $('.moove_gdpr_company_logo_upload').click(function(e) {
                                e.preventDefault();

                                var custom_uploader = wp.media({
                                    title: 'GDPR Modal - Company Logo',
                                    button: {
                                        text: 'Upload Logo'
                                    },
                                    multiple: false  // Set this to true to allow multiple files to be selected
                                })
                                .on('select', function() {
                                    var attachment = custom_uploader.state().get('selection').first().toJSON();
                                    $('.moove_gdpr_company_logo_holder').css('background-image', 'url('+attachment.url+')');
                                    $('input[name=moove_gdpr_company_logo]').val(attachment.url);

                                })
                                .open();
                            });
                        });
                    </script>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_logo_position"><?php _e('Logo Position','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_logo_position" type="radio" value="left" id="moove_gdpr_logo_position_left" <?php echo isset( $gdpr_options['moove_gdpr_logo_position'] ) ? ( $gdpr_options['moove_gdpr_logo_position'] === 'left'  ? 'checked' : '' ) : 'checked'; ?> class="regular-text on-off"> <label for="moove_gdpr_logo_position_left"><?php _e('Left','moove-gdpr'); ?></label> <span class="separator"></span>
                    <input name="moove_gdpr_logo_position" type="radio" value="center" id="moove_gdpr_logo_position_center" <?php echo isset( $gdpr_options['moove_gdpr_logo_position'] ) ? ( $gdpr_options['moove_gdpr_logo_position'] === 'center'  ? 'checked' : '' ) : ''; ?> class="regular-text on-off"> <label for="moove_gdpr_logo_position_center"><?php _e('Center','moove-gdpr'); ?></label> <span class="separator"></span>
                    <input name="moove_gdpr_logo_position" type="radio" value="right" id="moove_gdpr_logo_position_right" <?php echo isset( $gdpr_options['moove_gdpr_logo_position'] ) ? ( $gdpr_options['moove_gdpr_logo_position'] === 'right'  ? 'checked' : '' ) : ''; ?> class="regular-text on-off"> <label for="moove_gdpr_logo_position_right"><?php _e('Right','moove-gdpr'); ?></label>

                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_plugin_layout"><?php _e('Choose your layout','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_plugin_layout" type="radio" value="v1" id="moove_gdpr_plugin_layout_v1" <?php echo isset( $gdpr_options['moove_gdpr_plugin_layout'] ) ? ( $gdpr_options['moove_gdpr_plugin_layout'] === 'v1'  ? 'checked' : '' ) : 'checked'; ?> class="regular-text on-off"> <label for="moove_gdpr_plugin_layout_v1"><?php _e('Tabs layout','moove-gdpr'); ?></label> <span class="separator"></span>

                    <input name="moove_gdpr_plugin_layout" type="radio" value="v2" id="moove_gdpr_plugin_layout_v2" <?php echo isset( $gdpr_options['moove_gdpr_plugin_layout'] ) ? ( $gdpr_options['moove_gdpr_plugin_layout'] === 'v2'  ? 'checked' : '' ) : ''; ?> class="regular-text on-off"> <label for="moove_gdpr_plugin_layout_v2"><?php _e('One page layout','moove-gdpr'); ?></label>

                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_modal_save_button_label"><?php _e('Save Settings - Button Label','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_modal_save_button_label<?php echo $wpml_lang; ?>" type="text" id="moove_gdpr_modal_save_button_label" value="<?php echo isset( $gdpr_options['moove_gdpr_modal_save_button_label'.$wpml_lang] ) && $gdpr_options['moove_gdpr_modal_save_button_label'.$wpml_lang] ? $gdpr_options['moove_gdpr_modal_save_button_label'.$wpml_lang] : __('Save Changes','moove-gdpr'); ?>" class="regular-text">
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_modal_allow_button_label"><?php _e('Enable All - Button Label','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_modal_allow_button_label<?php echo $wpml_lang; ?>" type="text" id="moove_gdpr_modal_allow_button_label" value="<?php echo isset( $gdpr_options['moove_gdpr_modal_allow_button_label'.$wpml_lang] ) && $gdpr_options['moove_gdpr_modal_allow_button_label'.$wpml_lang] ? $gdpr_options['moove_gdpr_modal_allow_button_label'.$wpml_lang] : __('Enable All','moove-gdpr'); ?>" class="regular-text">
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_modal_allow_button_label"><?php _e('Checkbox Labels','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_modal_enabled_checkbox_label<?php echo $wpml_lang; ?>" type="text" id="moove_gdpr_modal_enabled_checkbox_label" value="<?php echo isset( $gdpr_options['moove_gdpr_modal_enabled_checkbox_label'.$wpml_lang] ) && $gdpr_options['moove_gdpr_modal_enabled_checkbox_label'.$wpml_lang] ? $gdpr_options['moove_gdpr_modal_enabled_checkbox_label'.$wpml_lang] : __('Enabled','moove-gdpr'); ?>" class="regular-text"><br />
                    <input name="moove_gdpr_modal_disabled_checkbox_label<?php echo $wpml_lang; ?>" type="text" id="moove_gdpr_modal_disabled_checkbox_label" value="<?php echo isset( $gdpr_options['moove_gdpr_modal_disabled_checkbox_label'.$wpml_lang] ) && $gdpr_options['moove_gdpr_modal_disabled_checkbox_label'.$wpml_lang] ? $gdpr_options['moove_gdpr_modal_disabled_checkbox_label'.$wpml_lang] : __('Disabled','moove-gdpr'); ?>" class="regular-text">
                </td>

            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_modal_powered_by_label"><?php _e('Powered by Label','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_modal_powered_by_label<?php echo $wpml_lang; ?>" type="text" id="moove_gdpr_modal_powered_by_label" value="<?php echo isset( $gdpr_options['moove_gdpr_modal_powered_by_label'.$wpml_lang] ) && $gdpr_options['moove_gdpr_modal_powered_by_label'.$wpml_lang] ? $gdpr_options['moove_gdpr_modal_powered_by_label'.$wpml_lang] : 'Powered by'; ?>" class="regular-text">
                </td>

            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_modal_allow_button_label"><?php _e('Strictly necessary required message.','moove-gdpr'); ?></label>
                </th>
                <td>
                    <textarea name="moove_gdpr_modal_strictly_secondary_notice<?php echo $wpml_lang; ?>" id="moove_gdpr_modal_strictly_secondary_notice" class="regular-text"><?php echo isset( $gdpr_options['moove_gdpr_modal_strictly_secondary_notice'.$wpml_lang] ) && $gdpr_options['moove_gdpr_modal_strictly_secondary_notice'.$wpml_lang] ? $gdpr_options['moove_gdpr_modal_strictly_secondary_notice'.$wpml_lang] : $gdpr_default_content->moove_gdpr_get_secondary_notice() ; ?></textarea>
                    <p class="description" id="moove_gdpr_modal_strictly_secondary_notice-description" style="max-width: 25em;"><?php _e('This warning message will be displayed if the Strictly necesarry cookies are not enabled and the user try to enable the "Third Party" or "Additional cookies"','moove-gdpr'); ?></p>
                </td>

            </tr>



        </tbody>
    </table>
    <br />
    <hr />
    <h2><?php _e('Cookie Info Bar Settings','moove-gdpr'); ?></h2>
    <hr />

    <table class="form-table">
        <tbody>
            <tr>
                <th scope="row" colspan="2" style="padding-bottom: 0;">
                    <label for="moove_gdpr_info_bar_content"><?php _e('Infobar Content','moove-gdpr'); ?></label>
                </th>
            </tr>
            <tr class="moove_gdpr_table_form_holder">
                <th colspan="2" scope="row">
                    <?php
                        $content =  isset( $gdpr_options['moove_gdpr_info_bar_content'.$wpml_lang] ) && $gdpr_options['moove_gdpr_info_bar_content'.$wpml_lang] ? maybe_unserialize( $gdpr_options['moove_gdpr_info_bar_content'.$wpml_lang] ) : false;
                        if ( ! $content ) :
                            $_content   = __("<p>We are using cookies to give you the best experience on our website.</p><p>You can find out more about which cookies we are using or switch them off in [setting]settings[/setting].</p>","moove-gdpr");
                            $content    = $_content;
                        endif;
                        ?>
                    <?php
                        $settings = array (
                            'media_buttons'     =>  false,
                            'editor_height'     =>  150,
                            'teeny'             =>  true
                        );
                        wp_editor( $content, 'moove_gdpr_info_bar_content', $settings );
                    ?>
                    <p class="description"><?php _e('You can use the following shortcut to link the settings modal:<br><span><strong>[setting]</strong>settings<strong>[/setting]</strong></span>','moove-gdpr'); ?></p>
                </th>
            </tr>
            <tr>
                <th scope="row">
                    <label for="moove_gdpr_infobar_accept_button_label"><?php _e('Accept - Button Label','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_infobar_accept_button_label<?php echo $wpml_lang; ?>" type="text" id="moove_gdpr_infobar_accept_button_label" value="<?php echo isset( $gdpr_options['moove_gdpr_infobar_accept_button_label'.$wpml_lang] ) && $gdpr_options['moove_gdpr_infobar_accept_button_label'.$wpml_lang] ? $gdpr_options['moove_gdpr_infobar_accept_button_label'.$wpml_lang] : __('Accept','moove-gdpr'); ?>" class="regular-text">
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_colour_scheme"><?php _e('Colour scheme','moove-gdpr'); ?></label>
                </th>
                <td>
                    <fieldset>
                        <legend class="screen-reader-text"><span><?php _e('Enable','moove-gdpr'); ?></span></legend>
                            <input name="moove_gdpr_colour_scheme" type="radio" <?php echo isset( $gdpr_options['moove_gdpr_colour_scheme'] ) ? ( intval( $gdpr_options['moove_gdpr_colour_scheme'] ) === 1  ? 'checked' : ( ! isset( $gdpr_options['moove_gdpr_colour_scheme'] ) ? 'checked' : '' ) ) : 'checked'; ?> id="moove_gdpr_colour_scheme_dark" value="1">
                            <label for="moove_gdpr_colour_scheme_dark"><?php _e('Dark','moove-gdpr'); ?></label> <br>

                            <input name="moove_gdpr_colour_scheme" type="radio" <?php echo isset( $gdpr_options['moove_gdpr_colour_scheme'] ) ? ( intval( $gdpr_options['moove_gdpr_colour_scheme'] ) === 2  ? 'checked' : '' ) : ''; ?> id="moove_gdpr_colour_scheme_light" value="2">
                            <label for="moove_gdpr_colour_scheme_light"><?php _e('Light','moove-gdpr'); ?></label>
                    </fieldset>
                </td>
            </tr>

        </tbody>
    </table>

    <br />
    <hr />
    <h2><?php _e('Change Settings - Floating Button','moove-gdpr'); ?></h2>
    <hr />

    <table class="form-table">
        <tbody>
            <tr>
                <th scope="row">
                    <label for="moove_gdpr_floating_button_enable"><?php _e('Enable Floating Button','moove-gdpr'); ?></label>
                </th>
                <td>
                    <fieldset>
                        <legend class="screen-reader-text"><span><?php _e('Enable','moove-gdpr'); ?></span></legend>
                        <label for="moove_gdpr_floating_button_enable">
                            <input name="moove_gdpr_floating_button_enable" type="checkbox" <?php echo isset( $gdpr_options['moove_gdpr_floating_button_enable'] ) ? ( intval( $gdpr_options['moove_gdpr_floating_button_enable'] ) === 1  ? 'checked' : '' ) : ''; ?> id="moove_gdpr_floating_button_enable" value="1">
                            <?php _e('Enable','moove-gdpr'); ?></label>
                    </fieldset>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_floating_button_label"><?php _e('Button - Hover Label','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_floating_button_label<?php echo $wpml_lang; ?>" type="text" id="moove_gdpr_floating_button_label" value="<?php echo isset( $gdpr_options['moove_gdpr_floating_button_label'.$wpml_lang] ) && $gdpr_options['moove_gdpr_floating_button_label'.$wpml_lang] ? $gdpr_options['moove_gdpr_floating_button_label'.$wpml_lang] : __('Change cookie settings','moove-gdpr'); ?>" class="regular-text">
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_floating_button_position"><?php _e('Button - Custom Position (CSS)','moove-gdpr'); ?></label>
                </th>
                <td>
                    <input name="moove_gdpr_floating_button_position" type="text" id="moove_gdpr_floating_button_position" value="<?php echo isset( $gdpr_options['moove_gdpr_floating_button_position'] ) && $gdpr_options['moove_gdpr_floating_button_position'] ? $gdpr_options['moove_gdpr_floating_button_position'] : 'bottom: 20px; left: 20px;'; ?>" class="regular-text">
                    <p class="description" id="moove_gdpr_floating_button_position-description"><?php _e('You can align the position eg.: <strong>top: 20px; right: 20px;</strong>','moove-gdpr'); ?></p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_floating_button_background_colour"><?php _e('Button - Background Colour','moove-gdpr'); ?></label>
                </th>
                <td>
                    <div class="iris-colorpicker-group-cnt">
                        <?php $color = isset( $gdpr_options['moove_gdpr_floating_button_background_colour'] ) && $gdpr_options['moove_gdpr_floating_button_background_colour'] ? $gdpr_options['moove_gdpr_floating_button_background_colour'] : '373737'; ?>
                        <input class="iris-colorpicker regular-text" name="moove_gdpr_floating_button_background_colour" value="<?php echo $color; ?>" style="background-color: <?php echo $color; ?>;" >
                        <span class="iris-selectbtn"><?php _e('Select','moove-gdpr'); ?></span>
                    </div>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_floating_button_hover_background_colour"><?php _e('Button - Hover Background Colour','moove-gdpr'); ?></label>
                </th>
                <td>
                    <div class="iris-colorpicker-group-cnt">
                        <?php $color = isset( $gdpr_options['moove_gdpr_floating_button_hover_background_colour'] ) && $gdpr_options['moove_gdpr_floating_button_hover_background_colour'] ? $gdpr_options['moove_gdpr_floating_button_hover_background_colour'] : '000000';; ?>
                        <input class="iris-colorpicker regular-text" name="moove_gdpr_floating_button_hover_background_colour" value="<?php echo $color ?>" style="background-color: <?php echo $color; ?>;" >
                        <span class="iris-selectbtn"><?php _e('Select','moove-gdpr'); ?></span>
                    </div>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="moove_gdpr_floating_button_font_colour"><?php _e('Button - Font Colour','moove-gdpr'); ?></label>
                </th>
                <td>
                    <div class="iris-colorpicker-group-cnt">
                        <?php $color = isset( $gdpr_options['moove_gdpr_floating_button_font_colour'] ) && $gdpr_options['moove_gdpr_floating_button_font_colour'] ? $gdpr_options['moove_gdpr_floating_button_font_colour'] : 'ffffff'; ?>
                        <input class="iris-colorpicker regular-text" name="moove_gdpr_floating_button_font_colour" value="<?php echo $color; ?>" style="background-color: <?php echo $color; ?>;" >
                        <span class="iris-selectbtn"><?php _e('Select','moove-gdpr'); ?></span>
                    </div>
                </td>
            </tr>

        </tbody>
    </table>

    <br />
    <hr />
    <br />
    <button type="submit" class="button button-primary"><?php _e('Save changes','moove-gdpr'); ?></button>
</form>