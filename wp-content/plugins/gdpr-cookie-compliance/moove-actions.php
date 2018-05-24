<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Moove_GDPR_Actions File Doc Comment
 *
 * @category  Moove_GDPR_Actions
 * @package   moove-gdpr-tracking
 * @author    Gaspar Nemes
 */

/**
 * Moove_GDPR_Actions Class Doc Comment
 *
 * @category Class
 * @package  Moove_GDPR_Actions
 * @author   Gaspar Nemes
 */
class Moove_GDPR_Actions {
	/**
	 * Global cariable used in localization
	 *
	 * @var array
	 */
	var $gdpr_loc_data;
	/**
	 * Construct
	 */
	function __construct() {
		$this->moove_register_scripts();
		$this->moove_register_ajax_actions();
		add_action( 'plugins_loaded', array( &$this, 'moove_gdpr_load_textdomain' ) );
	}

	/**
	 * Register Front-end / Back-end scripts
	 *
	 * @return void
	 */
	public function moove_register_scripts() {
		if ( is_admin() ) :
			add_action( 'admin_enqueue_scripts', array( &$this, 'moove_gdpr_admin_scripts' ) );
		else :
			add_action( 'wp_enqueue_scripts', array( &$this, 'moove_frontend_gdpr_scripts' ), 999 );
		endif;
	}

	/**
	 * Register global variables to head, AJAX, Form validation messages
	 *
	 * @param  string $ascript The registered script handle you are attaching the data for.
	 * @return void
	 */
	public function moove_localize_script( $ascript ) {

		$this->gdpr_loc_data = array(
			'ajaxurl'								=>	admin_url( 'admin-ajax.php' ),
			'post_id'								=>	get_the_ID(),
			'plugin_dir'							=> 	plugins_url( basename( dirname( __FILE__ ) ) ),
			'is_page'								=>	is_page(),
			'is_single'								=>	is_single(),
			'current_user'							=>	get_current_user_id(),
		);
		wp_localize_script( $ascript, 'moove_frontend_gdpr_scripts', $this->gdpr_loc_data );

	}

	/**
	 * Registe FRONT-END Javascripts and Styles
	 *
	 * @return void
	 */
	public function moove_frontend_gdpr_scripts() {

		wp_enqueue_script( 'moove_gdpr_frontend', plugins_url( basename( dirname( __FILE__ ) ) ) . '/dist/scripts/main.js', array( 'jquery' ), MOOVE_GDPR_VERSION, true );
		wp_enqueue_style( 'moove_gdpr_frontend', plugins_url( basename( dirname( __FILE__ ) ) ) . '/dist/styles/main.css', '', MOOVE_GDPR_VERSION );
		$this->moove_localize_script( 'moove_gdpr_frontend' );
	}
	/**
	 * Registe BACK-END Javascripts and Styles
	 *
	 * @return void
	 */
	public function moove_gdpr_admin_scripts() {
		wp_enqueue_script( 'moove_gdpr_backend', plugins_url( basename( dirname( __FILE__ ) ) ) . '/dist/scripts/admin.js', array( 'jquery', 'jquery-ui-core', 'jquery-ui-slider', 'jquery-ui-draggable' ), MOOVE_GDPR_VERSION, true );
		wp_enqueue_style( 'moove_gdpr_backend', plugins_url( basename( dirname( __FILE__ ) ) ) . '/dist/styles/admin.css', '', MOOVE_GDPR_VERSION );
	}

	/**
	 * Register AJAX actions for the plugin
	 */
	public function moove_register_ajax_actions() {
		add_action( 'wp_ajax_moove_gdpr_get_scripts', array( 'Moove_GDPR_Controller', 'moove_gdpr_get_scripts' ) );
		add_action( 'wp_ajax_nopriv_moove_gdpr_get_scripts', array( 'Moove_GDPR_Controller', 'moove_gdpr_get_scripts' ) );
	}

	/**
	 * GDPR Modal Footer Branding
	 */
	public function moove_gdpr_footer_branding_content() {
		ob_start();
		?>
		<?php
			$gdpr_default_content = new Moove_GDPR_Content();
		 	$option_name    = $gdpr_default_content->moove_gdpr_get_option_name();
            $modal_options  = get_option( $option_name );
            $wpml_lang      = $gdpr_default_content->moove_gdpr_get_wpml_lang();
			$powered_label 	= ( isset( $modal_options['moove_gdpr_modal_powered_by_label'.$wpml_lang] ) && $modal_options['moove_gdpr_modal_powered_by_label'.$wpml_lang] ) ? $modal_options['moove_gdpr_modal_powered_by_label'.$wpml_lang] : 'Powered by';
		?>
		<a href="https://wordpress.org/plugins/gdpr-cookie-compliance" target="_blank" class='moove-gdpr-branding'><?php echo $powered_label; ?> GDPR <?php _e('plugin','moove-gdpr'); ?></a>
		<?php
		return ob_get_clean();
	}

	/**
	 * Load plugin textdomain.
	 *
	 */
	public function moove_gdpr_load_textdomain() {
		load_plugin_textdomain( 'moove-gdpr', false, basename( dirname( __FILE__ ) ) . '/languages' );
	}
}
$moove_gdpr_actions_provider = new Moove_GDPR_Actions();

