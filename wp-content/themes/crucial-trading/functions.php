<?php
/**
 * Crucial Trading functions and definitions.
 *
 * @package Crucial_Trading
 */


/**
 * Create first time visitor cookie 
 *
 */
/*add_action( 'init', 'is_first_time');
function is_first_time() {
    if (isset($_COOKIE['_wp_first_time'])) {
        return false;
    } else {
        // expires in 30 days.
        setcookie('_wp_first_time', 1, time() + (WEEK_IN_SECONDS * 4), COOKIEPATH, COOKIE_DOMAIN, false);

        return true;
    }
}*/


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
	wp_enqueue_style( 'crucial-trading-style', get_stylesheet_uri() );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/assets/css/vendor/bootstrap.min.css', false );
	wp_enqueue_style( 'animate', get_template_directory_uri() . '/assets/css/vendor/animate.min.css', false );
	wp_enqueue_style( 'flags', get_template_directory_uri() . '/assets/css/vendor/flag-icon.min.css', false );
	wp_enqueue_style( 'master', get_template_directory_uri() . '/assets/css/dist/master.min.css', false );

	wp_enqueue_script( 'super-slider', get_template_directory_uri() . '/assets/js/vendor/super-slider.min.js"', false );
	//wp_enqueue_script( 'skrollr', get_template_directory_uri() . '/assets/js/vendor/skrollr.min.js"', false );
	wp_enqueue_script( 'bx-slider', get_template_directory_uri() . '/assets/js/vendor/bxslider.min.js', false );
	wp_enqueue_script( 'zoom', get_template_directory_uri() . '/assets/js/vendor/jquery.elevatezoom.min.js', false );
	wp_enqueue_script( 'gmap', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC2TBY8zzbNJ9o0DeoLZGZM6oDCDOruKdE', false );
	wp_enqueue_script( 'wow', get_template_directory_uri() . '/assets/js/vendor/wow.min.js', false );
	wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/assets/js/vendor/modernizr.object-fit.min.js', false );
	wp_enqueue_script( 'masonry', 'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.1.1/masonry.pkgd.min.js', false );
	wp_enqueue_script( 'cookie', 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js', false );
	wp_enqueue_script( 'headroom', 'https://cdnjs.cloudflare.com/ajax/libs/headroom/0.9.3/headroom.min.js', false );
	wp_enqueue_script( 'headroomjq', 'https://cdnjs.cloudflare.com/ajax/libs/headroom/0.9.3/jQuery.headroom.min.js', false );
	wp_enqueue_script( 'master', get_template_directory_uri() . '/assets/js/dist/master.min.js', false );

	// https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap
}
add_action( 'wp_enqueue_scripts', 'crucial_trading_scripts' );


/**
 * Include patterns
 */
$patterns_directory = get_template_directory() . '/patterns';
$scan               = array_values(array_diff(scandir($patterns_directory), array('..', '.', '.gitignore', 'gulpfile.js', 'package.json', 'node_modules', '.DS_Store', 'css')));

for ( $i = 0; $i < count($scan); $i++ ) {
	include_once(get_template_directory() . '/patterns/' . $scan[$i] . '/' . $scan[$i] . '.php');
}


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
 * Save custom Rug Builder data
 *
 */

add_filter( 'woocommerce_add_cart_item_data', 'save_cart_item_data', 10, 3 );

function save_cart_item_data( $cart_item_data, $product_id, $variation_id ) {

	$cart_item_data = array();

	if ( array_key_exists( 'center', $_GET ) && $_GET['center'] == $product_id ) {
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

	if ( isset( $cartItemSessionData['price'] ) ) {
		$cartItemData['price'] = $cartItemSessionData['price'];
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

	return $cartItemData;
}

add_action( 'woocommerce_add_order_item_meta', 'save_item_meta', 10, 3 );

function save_item_meta( $itemId, $values, $key ) {

	if ( isset( $values['length'] ) ) {
		wc_add_order_item_meta( $itemId, 'Length', $values['length'] );
	}

	if ( isset( $values['width'] ) ) {
		wc_add_order_item_meta( $itemId, 'Width', $values['width'] );
	}

	if ( isset( $values['price'] ) ) {
		wc_add_order_item_meta( $itemId, 'Price', '£' . $values['price'] );
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
}