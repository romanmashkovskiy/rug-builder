<?php
/**
 * Crucial Trading functions and definitions.
 *
 * @package Crucial_Trading
 */

/** Remove old swatches hook */

/*add_action('init', 'remove_old_send_file_hook');
function remove_old_send_file_hook() {
	wp_clear_scheduled_hook( 'send_file_hook' );
}*/

/**
 * Turn Off WooCommerce Styles
 */

//add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

/**
 * Load Custom Post Types
 */
require get_template_directory() . '/inc/post-types/include.php';

/**
 * Load Woocommerce files.
 */
require get_template_directory() . '/inc/woocommerce/include.php';

/**
 * Load meta boxes.
 */
require get_template_directory() . '/inc/meta-boxes.php';

/**
 * Load category subtitles.
 */
require get_template_directory() . '/inc/category-subtitles.php';


if ( ! function_exists( 'crucial_trading_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function crucial_trading_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on Crucial Trading, use a find and replace
	 * to change 'crucial-trading' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'crucial-trading', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );


	/*
	 * Add new role for hospitality people
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */

	add_role( 'hospitality', 'Hospitality');


	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary', 'crucial-trading' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'crucial_trading_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif;
add_action( 'after_setup_theme', 'crucial_trading_setup' );


/**
 * Add WooCommerce theme support
 *
 */

add_action( 'after_setup_theme', 'woocommerce_support' );

function woocommerce_support() {
	add_theme_support( 'woocommerce' );
}

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function crucial_trading_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'crucial_trading_content_width', 640 );
}
add_action( 'after_setup_theme', 'crucial_trading_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function crucial_trading_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'crucial-trading' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'crucial-trading' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'crucial_trading_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function crucial_trading_scripts() {


	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	if ( constant('WP_ENV') == 'local' || constant('WP_ENV') == 'development' || constant('WP_ENV') == 'staging'  ) :

		wp_enqueue_style( 'master', get_template_directory_uri() . '/assets/dev/css/build.min.css', true );
		//wp_enqueue_style( 'master', get_template_directory_uri() . '/assets/dev/css/build.min.js', true );
		wp_enqueue_script( 'master-js', get_template_directory_uri() . '/assets/js/dist/master.min.js', '', '', true );

  elseif ( constant('WP_ENV') == 'production' ) :

		wp_enqueue_style( 'master-css', get_template_directory_uri() . '/assets/css/dist/master.min.css', true );
		wp_enqueue_script( 'master-js', get_template_directory_uri() . '/assets/js/dist/master.min.js', '', '', true );

	endif;

}
add_action( 'wp_enqueue_scripts', 'crucial_trading_scripts' );


/**
 * Load Google Maps on retailer page only
 */

 function ct_enqueue_gmaps() {
   if ( is_page( 'find-retailer' ) ) {
     wp_enqueue_script( 'gmap', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC2TBY8zzbNJ9o0DeoLZGZM6oDCDOruKdE', '', '', true );
   }
 }
 add_action( 'wp_enqueue_scripts', 'ct_enqueue_gmaps' );


/**
 * Include patterns
 */
$patterns_directory = get_template_directory() . '/patterns';
$scan               = array_values(array_diff(scandir($patterns_directory), array('..', '.', '.gitignore', 'gulpfile.js', 'package.json', 'node_modules', '.DS_Store', 'css')));

for ( $i = 0; $i < count($scan); $i++ ) {
	include_once(get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.php');
}


/*********************************************************
 * Password Strength
 *********************************************************/

/**
 *Reduce the strength requirement on the woocommerce password.
 *
 * Strength Settings
 * 3 = Strong (default)
 * 2 = Medium
 * 1 = Weak
 * 0 = Very Weak / Anything
 */
function reduce_woocommerce_min_strength_requirement( $strength ) {
    return 2;
}
add_filter( 'woocommerce_min_password_strength', 'reduce_woocommerce_min_strength_requirement' );

// Remove it entirely
/*function wc_ninja_remove_password_strength() {
	if ( wp_script_is( 'wc-password-strength-meter', 'enqueued' ) ) {
		wp_dequeue_script( 'wc-password-strength-meter' );
	}
}
add_action( 'wp_print_scripts', 'wc_ninja_remove_password_strength', 100 );*/


/**
 * Allow SVG upload.
 */

add_filter( 'wp_check_filetype_and_ext', function($data, $file, $filename, $mimes) {

  global $wp_version;

  $wp_versions = array( '4.7.1', '4.7.2' );

  if ( !in_array( $wp_version, $wp_versions ) ) {
     return $data;
  }

  $filetype = wp_check_filetype( $filename, $mimes );

  return [
      'ext'             => $filetype['ext'],
      'type'            => $filetype['type'],
      'proper_filename' => $data['proper_filename']
  ];

}, 10, 4 );

function cc_mime_types( $mimes ){
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter( 'upload_mimes', 'cc_mime_types' );

function fix_svg() {
  echo '<style type="text/css">
        .attachment-266x266, .thumbnail img {
             width: 100% !important;
             height: auto !important;
        }
        </style>';
}
add_action( 'admin_head', 'fix_svg' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
//require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
//require get_template_directory() . '/inc/jetpack.php';

/**
 * Sort materials by menu order
 */
function sort_materials_menu_order( $materials ) {

	for ( $o = 0; $o < count( $materials ); $o++ ) {

		$material      = $materials[$o];
		$material_id   = $material->term_id;
		$material_meta = get_option( "category_$material_id" );

		$material->order = array_key_exists( 'menu_order', $material_meta ) ? $material_meta['menu_order'] : 0;

	}

	function cmp( $a, $b ) {
		return $a->order - $b->order;
	}

	usort( $materials, 'cmp' );

	return $materials;

}

/**
 * Exclude Rug Borders parent category from materials
 */
function exclude_rug_borders( $materials ) {

	for ( $i = 0; $i < count( $materials ); $i++ ) {
		if ( $materials[$i]->slug == 'rug-borders' ) {
			unset( $materials[$i] );
			break;
		}
	}

	return array_values( $materials );

}

/**
 * Extend WordPress search to include custom fields
 *
 * http://adambalee.com
 */

/**
 * Join posts and postmeta tables
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_join
 */
function cf_search_join( $join ) {
    global $wpdb;

    if ( is_search() ) {
        $join .=' LEFT JOIN '.$wpdb->postmeta. ' ON '. $wpdb->posts . '.ID = ' . $wpdb->postmeta . '.post_id ';
    }

    return $join;
}
add_filter('posts_join', 'cf_search_join' );

/**
 * Modify the search query with posts_where
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_where
 */
function cf_search_where( $where ) {
    global $pagenow, $wpdb;

    if ( is_search() ) {
        $where = preg_replace(
            "/\(\s*".$wpdb->posts.".post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
            "(".$wpdb->posts.".post_title LIKE $1) OR (".$wpdb->postmeta.".meta_value LIKE $1)", $where );
    }

    return $where;
}
add_filter( 'posts_where', 'cf_search_where' );

/**
 * Prevent duplicates
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_distinct
 */
function cf_search_distinct( $where ) {
    global $wpdb;

    if ( is_search() ) {
        return "DISTINCT";
    }

    return $where;
}
add_filter( 'posts_distinct', 'cf_search_distinct' );



/**
 * Redirect to login page after successful registration
 *
 */
add_action( 'wppb_before_saving_form_values', 'abc' );

function abc() {
	echo '<script>window.location.href = "' . site_url() . '/my-login"</script>';
}


/**
 * Re-order date on admin columns
 *
 */
add_filter( 'post_date_column_time' , 'woo_custom_post_date_column_time' );
/**
 * woo_custom_post_date_column_time
 *
 * @access      public
 * @since       1.0
 * @return      void
*/
function woo_custom_post_date_column_time( $post ) {

	$h_time = get_post_time( __( 'd/m/Y', 'woocommerce' ), $post );

	return $h_time;

}

/**
 * Calculate distance between two lat/lng co-ords
 *
 */

function distance_between_lat_lng( $lat1, $lon1, $lat2, $lon2 ) {

	$theta = floatval($lon1) - floatval($lon2);
	$float_lat1 = floatval($lat1);
	$float_lat2 = floatval($lat2);
	$dist  = sin( deg2rad( $float_lat1 ) ) * sin( deg2rad( $float_lat2 ) ) +  cos( deg2rad( $float_lat1 ) ) * cos( deg2rad( $float_lat2 ) ) * cos( deg2rad( $theta ) );
	$dist  = acos( $dist );
	$dist  = rad2deg( $dist );

	return $dist * 60 * 1.1515;

}

/**
 * Add 'Number of Retailers to Send Email to' setting
 *
 */

add_action( 'admin_init', 'register_email_setting' );

function register_email_setting() {
    add_settings_section(
        'my_settings_section', // Section ID
        '', // Section Title
        'my_section_options_callback', // Callback
        'general' // What Page?  This makes the section show up on the General Settings Page
    );

    add_settings_field( // Option 1
        'option_1', // Option ID
        'Number of Retailers to Send Bespoke Rug Emails to', // Label
        'my_textbox_callback', // !important - This is where the args go!
        'general', // Page it will be displayed (General Settings)
        'my_settings_section', // Name of our section
        array( // The $args
            'number_bespoke_emails' // Should match Option ID
        )
    );

    register_setting('general', 'number_bespoke_emails', 'esc_attr');
}

function my_section_options_callback() { // Section Callback
    return;
}

function my_textbox_callback($args) {  // Textbox Callback
    $option = get_option($args[0]);
    echo '<input type="text" id="'. $args[0] .'" name="'. $args[0] .'" value="' . $option . '" />';
}


/**
 * Save custom Rug Builder data
 *
 */

add_filter( 'woocommerce_add_cart_item_data', 'save_cart_item_data', 10, 3 );

function save_cart_item_data( $cart_item_data, $product_id, $variation_id ) {

	$cart_item_data = array();

	if ( array_key_exists( 'center', $_GET ) ) {
		$cart_item_data['center'] = array_key_exists( 'center', $_GET ) ? $_GET['center'] : 0;
		$cart_item_data['length'] = array_key_exists( 'length', $_GET ) ? $_GET['length'] : 0;
		$cart_item_data['width']  = array_key_exists( 'width', $_GET ) ? $_GET['width'] : 0;
		$cart_item_data['price']  = array_key_exists( 'price', $_GET ) ? $_GET['price'] : 0;
		$cart_item_data['inner']  = array_key_exists( 'inner', $_GET ) ? $_GET['inner'] : 0;

		if ( array_key_exists( 'piping', $_GET ) ) {
			$cart_item_data['piping'] = $_GET['piping'];
		}

		if ( array_key_exists( 'outer', $_GET ) ) {
			$cart_item_data['outer'] = $_GET['outer'];
		}
	}

	return $cart_item_data;
}

add_filter( 'woocommerce_get_cart_item_from_session', 'restore_cart_item_data', 10, 3 );

function restore_cart_item_data( $cartItemData, $cartItemSessionData, $cartItemKey ) {

	if ( isset( $cartItemSessionData['length'] ) ) {
		$cartItemData['length'] = $cartItemSessionData['length'];
	}

	if ( isset( $cartItemSessionData['width'] ) ) {
		$cartItemData['width'] = $cartItemSessionData['width'];
	}

	if ( isset( $cartItemSessionData['center'] ) ) {
		$cartItemData['center'] = $cartItemSessionData['center'];
	}

	if ( isset( $cartItemSessionData['inner'] ) ) {
		$cartItemData['inner'] = $cartItemSessionData['inner'];
	}

	if ( isset( $cartItemSessionData['piping'] ) ) {
		$cartItemData['piping'] = $cartItemSessionData['piping'];
	}

	if ( isset( $cartItemSessionData['outer'] ) ) {
		$cartItemData['outer'] = $cartItemSessionData['outer'];
	}

	if ( isset( $cartItemSessionData['price'] ) ) {
		$cartItemData['price'] = $cartItemSessionData['price'];
	}

	return $cartItemData;
}

add_filter( 'woocommerce_get_item_data', 'get_cart_item_data', 10, 2 );

function get_cart_item_data( $data, $cart_item ) {

	if ( isset( $cart_item['length'] ) ) {
		$data[] = array(
			'name'  => 'Length',
			'value' => $cart_item['length'] . 'm',
		);
	}

	if ( isset( $cart_item['width'] ) ) {
		$data[] = array(
			'name'  => 'Width',
			'value' => $cart_item['width'] . 'm',
		);
	}

	if ( isset( $cart_item['center'] ) ) {

		$sku = '';

		if ( class_exists( 'WC_Product' ) ) {
			$center = new WC_Product( $cart_item['center'] );
			$sku    = $center->get_sku();
		}

		$data[] = array(
			'name'  => 'Center Material',
			'value' => get_the_title( $cart_item['center'] ) . " ($sku)",
		);
	}

	if ( isset( $cart_item['inner'] ) ) {

		$sku = '';

		if ( class_exists( 'WC_Product' ) ) {
			$center = new WC_Product( $cart_item['inner'] );
			$sku    = $center->get_sku();
		}

		$data[] = array(
			'name'  => 'Inner Border',
			'value' => get_the_title( $cart_item['inner'] ) . " ($sku)",
		);
	}

	if ( isset( $cart_item['piping'] ) ) {

		$sku = '';

		if ( class_exists( 'WC_Product' ) ) {
			$center = new WC_Product( $cart_item['piping'] );
			$sku    = $center->get_sku();
		}

		$data[] = array(
			'name'  => 'Piping',
			'value' => get_the_title( $cart_item['piping'] ) . " ($sku)",
		);
	}

	if ( isset( $cart_item['outer'] ) ) {

		$sku = '';

		if ( class_exists( 'WC_Product' ) ) {
			$center = new WC_Product( $cart_item['outer'] );
			$sku    = $center->get_sku();
		}

		$data[] = array(
			'name'  => 'Outer Border',
			'value' => get_the_title( $cart_item['outer'] ) . " ($sku)",
		);
	}

	if ( isset( $cart_item['price'] ) ) {
		$data[] = array(
			'name'  => 'Price',
			'value' => '£' . $cart_item['price'],
		);
	}

	return $data;
}

add_action( 'woocommerce_add_order_item_meta', 'save_item_meta', 10, 3 );

function save_item_meta( $itemId, $values, $key ) {

	if ( isset( $values['length'] ) ) {
		wc_add_order_item_meta( $itemId, 'Length', $values['length'] . 'm' );
	}

	if ( isset( $values['width'] ) ) {
		wc_add_order_item_meta( $itemId, 'Width', $values['width'] . 'm' );
	}

	if ( isset( $values['center'] ) ) {
		wc_add_order_item_meta( $itemId, 'Center Material', get_the_title( $values['center'] ) );
	}

	if ( isset( $values['inner'] ) ) {
		wc_add_order_item_meta( $itemId, 'Inner Border', get_the_title( $values['inner'] ) );
	}

	if ( isset( $values['piping'] ) ) {
		wc_add_order_item_meta( $itemId, 'Piping', get_the_title( $values['piping'] ) );
	}

	if ( isset( $values['outer'] ) ) {
		wc_add_order_item_meta( $itemId, 'Outer Border', get_the_title( $values['outer'] ) );
	}

	if ( isset( $values['price'] ) ) {
		wc_add_order_item_meta( $itemId, 'Price', '£' . $values['price'] );
	}
}

// Email retailers when a bespoke rug is ordered

add_action( 'woocommerce_checkout_order_processed', 'email_retailer_bespoke_rug', 10, 2 );

function email_retailer_bespoke_rug( $order_id, $order_data ) {

	$order = new WC_Order( $order_id );
	$items = $order->get_items();
	$rug   = false;

	foreach ( $items as $item ) {
		if ( $item['name'] == 'Bespoke Rug' ) {
			$rug = $item;
			break;
		}
	}

	if ( !$rug ) {
		return;
	}

	$mailer = WC()->mailer();
	$emails = $mailer->get_emails();
	$email  = false;

	foreach ( $emails as $key => $mail ) {
		if ( $key == 'WC_Email_New_Order' ) {
			$email = $mail;
			break;
		}
	}

	if ( !$email ) {
		return;
	}
/*
	$args = array(
		'post_type'      => 'retailer',
		'posts_per_page' => -1,
	);

	$query = new WP_Query( $args );

	if ( !$query->have_posts() ) {
		return;
	}

	$customer_postcode = array_key_exists( 'shipping_postcode', $order_data ) ? $order_data['shipping_postcode'] : false;

	if ( !$customer_postcode ) {
		return;
	}

	$customer_postcode = urlencode( $customer_postcode );

	$url  = "http://maps.google.com/maps/api/geocode/json?address={$customer_postcode}";
	$json = file_get_contents($url);
	$resp = json_decode($json, true);

	if ( $resp['status'] != 'OK' ) {
		return;
	}

	$customer_lat = $resp['results'][0]['geometry']['location']['lat'];
	$customer_lng = $resp['results'][0]['geometry']['location']['lng'];

	$retailers = $query->posts;
	$email_to  = array();

	foreach ( $retailers as $key => $retailer ) {

		$retailer_id  = $retailer->ID;
		$retailer_lat = get_post_meta( $retailer_id, 'retailer_lat', true );
		$retailer_lng = get_post_meta( $retailer_id, 'retailer_lng', true );
		$distance     = distance_between_lat_lng( $retailer_lat, $retailer_lng, $customer_lat, $customer_lng );

		$retailer->distance = $distance;

	}

	function cmp( $a, $b ) {
		return $a->distance - $b->distance;
	}

	usort( $retailers, 'cmp' );

	$num_retailers_emailed = (int) get_option( 'number_bespoke_emails' ) > 0 ? (int) get_option( 'number_bespoke_emails' ) : 1;
	$recipients            = '';

	for ( $i = 0; $i < count($recipients); $i++ ) {

		$recip_email = get_post_meta( $retailers[$i]->ID, 'retailer_email', true );

		if ( !$recip_email || $recip_email == '' ) {
			continue;
		}

		$recipients .= $recip_email . ',';
	}

	$email->recipient = $recipients;
*/

	$email->recipient = 'Crucial.Consumer@crucial-trading.com';
	$email->trigger( $order_id );

}

// Add user meta and update role for Hospitality Users

add_action( 'pp_after_registration', 'add_hosp_user_meta', 10, 3 );

function add_hosp_user_meta( $form_id, $user_data, $user_id ) {

	// Meta

	$city    = array_key_exists( 'reg_city', $_POST ) ? $_POST['reg_city'] : false;
	$state   = array_key_exists( 'reg_state', $_POST ) ? $_POST['reg_state'] : false;
	$country = array_key_exists( 'reg_country', $_POST ) ? $_POST['reg_country'] : false;
	$phone   = array_key_exists( 'reg_phone', $_POST ) ? $_POST['reg_phone'] : false;
	$company = array_key_exists( 'reg_company', $_POST ) ? $_POST['reg_company'] : false;
	$dso     = array_key_exists( 'reg_dso', $_POST ) ? $_POST['reg_dso'] : false;
	$rep     = array_key_exists( 'reg_rep', $_POST ) ? $_POST['reg_rep'] : false;

	if ( $city ) {
		update_user_meta( $user_id, 'shipping_city', $city );
	}

	if ( $state ) {
		update_user_meta( $user_id, 'shipping_state', $state );
	}

	if ( $country ) {
		update_user_meta( $user_id, 'shipping_country', $country );
	}

	if ( $phone ) {
		update_user_meta( $user_id, 'billing_phone', $country );
	}

	if ( $company ) {
		update_user_meta( $user_id, '_hospitality_company', $company );
	}

	if ( $dso ) {
		update_user_meta( $user_id, '_hospitality_dso', $dso );
	}

	if ( $rep ) {
		update_user_meta( $user_id, '_hospitality_rep', $rep );
	}

	// Role

	$user = new WP_User( $user_id );

	$user->remove_role( 'subscriber' );
	$user->add_role( 'hospitality' );
}

// Show hospitality meta in profile page

add_action( 'show_user_profile', 'my_show_extra_profile_fields' );
add_action( 'edit_user_profile', 'my_show_extra_profile_fields' );

function my_show_extra_profile_fields( $user ) {

	if ( $user->roles[0] != 'hospitality' ) {
		return;
	}

	$dso_meta = esc_attr( get_the_author_meta( '_hospitality_dso', $user->ID ) );
	$dso      = $dso_meta == 'on' ? 'checked' : '';

	?>

	<h3>Information</h3>

	<table class="form-table">

		<tr>
			<th><label for="company">Company</label></th>
			<td>
				<input type="text" name="_hospitality_company" id="company" value="<?php echo esc_attr( get_the_author_meta( '_hospitality_company', $user->ID ) ); ?>" class="regular-text" /><br />
			</td>
		</tr>

		<tr>
			<th><label for="dso">Design Studio Online Access</label></th>
			<td>
				<input type="checkbox" name="_hospitality_dso" id="dso" <?php echo $dso; ?> /><br />
			</td>
		</tr>

		<tr>
			<th><label for="rep">Sales Representitve</label></th>
			<td>
				<input type="text" name="_hospitality_rep" id="rep" value="<?php echo esc_attr( get_the_author_meta( '_hospitality_rep', $user->ID ) ); ?>" class="regular-text" /><br />
			</td>
		</tr>

	</table>
<?php }

add_action( 'personal_options_update', 'my_save_extra_profile_fields' );
add_action( 'edit_user_profile_update', 'my_save_extra_profile_fields' );

function my_save_extra_profile_fields( $user_id ) {

	if ( !current_user_can( 'edit_user', $user_id ) )
		return false;

	update_usermeta( $user_id, '_hospitality_company', $_POST['_hospitality_company'] );
	update_usermeta( $user_id, '_hospitality_dso', $_POST['_hospitality_dso'] );
	update_usermeta( $user_id, '_hospitality_rep', $_POST['_hospitality_rep'] );
}
