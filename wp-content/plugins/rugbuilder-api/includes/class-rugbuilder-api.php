<?php
// require '../vendor/autoload.php';
// use Dompdf\Dompdf;

  class Rugbuilder_API {
    protected $plugin_name;
  	protected $version;
  	protected $path;
  	protected $routes;

    public function __construct() {
		$this->plugin_name = 'rugbuilder-api';
		$this->version     = '1.0.0';
		$this->path        = plugin_dir_path( dirname( __FILE__ ) );

		$this->load_dependencies();
    }

    private function load_dependencies() {
      error_log('require vendor autoload from place 2');

      require_once $this->path . 'vendor/autoload.php';

      require_once $this->path . 'includes/map-routes.php';
      $this->routes = new Rugbuilder_MapRoutes();
    }
  }
