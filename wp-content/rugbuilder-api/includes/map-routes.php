<?php

  class Rugbuidler_MapRoutes {
    protected $path;
    protected $apiAddress;
    protected $routes;
    protected $callbacks;

    public function __construct() {
      $this->path = plugin_dir_path(dirname(__FILE__));
      $this->namespace = 'api/v1';
      $this->routes = $this->get_routes();
      $this->callbacks = $this->get_callbacks();

      add_action('rest_api_init', function () {
        $this->map_routes();
      });
    }

    private function get_routes() {
      require_once $this->path . 'includes/routes.php';

      return $routes;
    }

    private function get_callbacks() {
      require_once $this->path . 'includes/endpoints.php';

      return $endpoints;
    }

    private function register_routes() {
      foreach ($this->routes as $route) {
        $args = array();

        $args['methods'] = $route['methods'];
        $args['callback'] = $this->callbacks[$route['callback']];

        if (array_key_exists('args', $route)) {
          $args['args'] = $route['args'];
        }

        register_rest_route($this->apiAddress, $route['endpoint'], $args);
      }
    }
  }
