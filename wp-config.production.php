<?php
/**
 * Production environment config settings
 *
 * Enter any WordPress config settings that are specific to this environment
 * in this file.
 *
 */

//define('WP_HOME','//www.crucial-trading.com');
//define('WP_SITEURL','//www.crucial-trading.com');

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', $_SERVER["RDS_DB_NAME"]);

/** MySQL database username */
define('DB_USER', $_SERVER["RDS_USERNAME"]);

/** MySQL database password */
define('DB_PASSWORD', $_SERVER["RDS_PASSWORD"]);

/** MySQL hostname */
define('DB_HOST', $_SERVER["RDS_HOSTNAME"]);

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

// Hide Errors

error_reporting(0);
ini_set('display_errors', 0);
