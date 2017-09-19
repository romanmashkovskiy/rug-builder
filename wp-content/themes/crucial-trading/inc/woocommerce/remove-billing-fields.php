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
 * Change Shipping to Delivery
 *********************************************************/
