<?php
/**
 * Setup environments
 * 
 * Set environment based on the current server hostname, this is stored
 * in the $hostname variable
 * 
 * You can define the current environment via: 
 *     define('WP_ENV', 'production');
 * 
 */


/*
 * Set environment based on hostname
 *
 * If you just use localhost for your local test environment then in place of:
 *   case 'domain.dev':
 *
 * Just use:
 *   case 'localhost':
 *
 */
switch ($hostname) {
    case 'localhost':
        define('WP_ENV', 'local');
        break;
    
    case 'vps.89hosting.co.uk':
        define('WP_ENV', 'staging');
        break;
    
    case 'park-it-systems.com':
        define('WP_ENV', 'production');
        break;
        
    case 'www.park-it-systems.com':
        define('WP_ENV', 'production');
        break;

    case 'parkit-env.elasticbeanstalk.com':
    default: 
        define('WP_ENV', 'production');
}

