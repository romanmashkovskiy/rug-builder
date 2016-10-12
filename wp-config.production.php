<?php
/**
 * Production environment config settings
 *
 * Enter any WordPress config settings that are specific to this environment 
 * in this file.
 * 
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'ebdb');

/** MySQL database username */
define('DB_USER', 'ctdbusr');

/** MySQL database password */
define('DB_PASSWORD', 'o~&Gg6RI^LP-');

/** MySQL hostname */
define('DB_HOST', 'parkit-rds.cvxv6ncmhply.eu-west-1.rds.amazonaws.com');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);
