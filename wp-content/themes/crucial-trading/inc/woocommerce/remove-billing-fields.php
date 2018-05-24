<?php


/**
* Remove the billing fields from the checkout form as we don't need them
*
* Contents:
* Add WooCommerce Action
* Create Order Code
*
* @package Crucial Trading
* @since Crucial Trading 1.0
*/
add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

function custom_override_checkout_fields( $fields ) {
    unset($fields['billing']['billing_first_name']);
    unset($fields['billing']['billing_last_name']);
    unset($fields['billing']['billing_company']);
    unset($fields['billing']['billing_address_1']);
    unset($fields['billing']['billing_address_2']);
    unset($fields['billing']['billing_city']);
    unset($fields['billing']['billing_postcode']);
    unset($fields['billing']['billing_country']);
    unset($fields['billing']['billing_state']);
    unset($fields['billing']['billing_phone']);
    unset($fields['billing']['billing_address_2']);
    unset($fields['billing']['billing_postcode']);
    unset($fields['billing']['billing_company']);
    unset($fields['billing']['billing_last_name']);
    unset($fields['billing']['billing_city']);
    return $fields;
}

/*********************************************************
 * WC Checkout Fields
 *********************************************************/


// Overdide default checkout fields

add_filter( 'woocommerce_default_address_fields' , 'custom_override_default_address_fields' );

function custom_override_default_address_fields( $fields ) {
     $fields['state']['required'] = false;
     $fields['state']['label'] = 'County (optional)';
     $fields['address_1']['placeholder'] = 'Address line 1';
     $fields['address_2']['placeholder'] = 'Address line 2';
     $fields['postcode']['label'] = 'Postcode';
     $fields['city']['label'] = 'City or town';

     return $fields;
}

// Change field order

add_filter("woocommerce_checkout_fields", "order_fields");

function order_fields($fields) {

    $order = array(
        "shipping_first_name",
        "shipping_last_name",
        "shipping_address_1",
        "shipping_address_2",
        "shipping_postcode",
        "shipping_state",
        "shipping_country",

    );
    foreach($order as $field)
    {
        $ordered_fields[$field] = $fields["shipping"][$field];
    }

    $fields["shipping"] = $ordered_fields;
    return $fields;

}

/*********************************************************
* GDPR & Privacy opt-ins
*********************************************************/

add_action( 'woocommerce_review_order_before_submit', 'crucial_add_checkout_privacy_policy', 9 );

 function crucial_add_checkout_privacy_policy() {

   woocommerce_form_field( 'privacy_policy', array(
       'type'          => 'checkbox',
       'class'         => array('form-row privacy'),
       'label_class'   => array('woocommerce-form__label woocommerce-form__label-for-checkbox checkbox'),
       'input_class'   => array('woocommerce-form__input woocommerce-form__input-checkbox input-checkbox'),
       'required'      => true,
       'label'         => 'I agree to my personal data being stored and used to process this order. This includes sharing my personal information and the details of my order with our partner retailers. Read our <a href="/privacy-policy">Privacy Policy</a> for more information. Please tick here to opt-in.',
   ));

}

add_action( 'woocommerce_review_order_before_submit', 'crucial_add_checkout_marketing_consent', 9 );

 function crucial_add_checkout_marketing_consent() {

   woocommerce_form_field( 'marketing_consent', array(
       'type'          => 'checkbox',
       'class'         => array('form-row privacy'),
       'label_class'   => array('woocommerce-form__label woocommerce-form__label-for-checkbox checkbox'),
       'input_class'   => array('woocommerce-form__input woocommerce-form__input-checkbox input-checkbox'),
       'required'      => false,
       'label'         => 'I would like to receive marketing communication including promotions, special offers, news and events from Crucial Trading. <a href="/privacy-policy">View Privacy Policy</a> Please tick here to opt in.',
   ));

}

// Show notice if customer does not tick required

add_action( 'woocommerce_checkout_process', 'bbloomer_not_approved_privacy' );

 function bbloomer_not_approved_privacy() {
     if ( ! (int) isset( $_POST['privacy_policy'] ) ) {
         wc_add_notice( __( 'We need your consent to our Privacy Policy to complete the checkout' ), 'error' );
     }
}


/**
 * Update the order meta with field value
 */

add_action( 'woocommerce_checkout_update_order_meta', 'ct_privacy_field_display_admin_order_meta' );

function ct_privacy_field_display_admin_order_meta( $order_id ) {
    if ( ! empty( $_POST['privacy_policy'] ) ) {
        update_post_meta( $order_id, 'privacy_policy', sanitize_text_field( $_POST['privacy_policy'] ) );
        update_post_meta( $order_id, 'marketing_consent', sanitize_text_field( $_POST['marketing_consent'] ) );
    }
}


/**
 * Display field value on the order edit page
 */
add_action( 'woocommerce_admin_order_data_after_billing_address', 'ct_custom_checkout_field_display_admin_order_meta', 10, 1 );

function ct_custom_checkout_field_display_admin_order_meta($order){

    $privacy_policy_consent_meta = get_post_meta( $order->id, 'privacy_policy', true );
    $marketing_policy_consent_meta = get_post_meta( $order->id, 'marketing_consent', true );

    if ($privacy_policy_consent_meta === '1') :
      $privacy_policy_consent = 'Yes';
    else :
      $privacy_policy_consent = 'No';
    endif;

    if ($marketing_policy_consent_meta === '1') :
      $marketing_policy_consent = 'Yes';
    else :
      $marketing_policy_consent = 'No';
    endif;

    echo '<p><strong>'.__('Privacy Consent').':</strong> <br/>' . $privacy_policy_consent . '</p>';
    echo '<p><strong>'.__('Marketing Consent').':</strong> <br/>' . $marketing_policy_consent . '</p>';
}
