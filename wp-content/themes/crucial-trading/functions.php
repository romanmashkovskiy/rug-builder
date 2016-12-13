<?php
/**
 * Crucial Trading functions and definitions.
 *
 * @package Crucial_Trading
 */

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

	wp_enqueue_script( 'lightbox', get_template_directory_uri() . '/assets/js/vendor/html5lightbox.js"', false );
	wp_enqueue_script( 'super-slider', get_template_directory_uri() . '/assets/js/vendor/super-slider.min.js"', false );
	wp_enqueue_script( 'skrollr', get_template_directory_uri() . '/assets/js/vendor/skrollr.min.js"', false );
	wp_enqueue_script( 'bx-slider', get_template_directory_uri() . '/assets/js/vendor/bxslider.min.js', false );
	wp_enqueue_script( 'zoom', get_template_directory_uri() . '/assets/js/vendor/jquery.elevatezoom.min.js', false );
	wp_enqueue_script( 'gmap', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCv6sAk010SfQFWdRWY-fuGuROBhcYtd-o', false );
	wp_enqueue_script( 'wow', get_template_directory_uri() . '/assets/js/vendor/wow.min.js', false );
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
function cc_mime_types($mimes) {
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');



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
