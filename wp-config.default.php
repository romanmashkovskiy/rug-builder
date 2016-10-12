<?php
/**
 * Default config settings
 *
 * Enter any WordPress config settings that are default to all environments
 * in this file. These can then be overridden in the environment config files.
 * 
 * Please note if you add constants in this file (i.e. define statements) 
 * these cannot be overridden in environment config files.
 * 
 * @package    Studio 24 WordPress Multi-Environment Config
 * @version    1.0
 * @author     Studio 24 Ltd  <info@studio24.net>
 */

/** S3 Offload **/ 

//define( 'AWS_ACCESS_KEY_ID', 'AKIAJOAETUM76BPUFAUQ' );
//define( 'AWS_SECRET_ACCESS_KEY', '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' );

/** Settings Site-wide **/ 

define('DISALLOW_FILE_EDIT', TRUE); 
define('WP_POST_REVISIONS', 5);
define('WP_MEMORY_LIMIT', '256M');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'Qiml{:+@>`|w!l.fSeE&RM`>:Jn+o&rYnhlO)N$V.V[nxCgzzvC@yXNA$1p{K3&9');
define('SECURE_AUTH_KEY',  '&Bx<0U7<+Y~aAm;`t;JF_+9O+cGc=Mo:K*&QE=I;1+~-%b[Gav-} .[NzI9{RH!f');
define('LOGGED_IN_KEY',    'k@m2T6o^+.jB@B_)RPtG*fp{[w1F@69EgIev2O5eP6d-~oA63ruO`cSc7R>jwZM^');
define('NONCE_KEY',        '),sq#{2||z^fRz]m{7{Z&|2>A=b]S2P0M!v_&7CrJ]6wnjdj5kbpx23+ )@1c?xQ');
define('AUTH_SALT',        'Eq[.s>-N;sh/:IG5GU4FW3UX?m-jqp!iz9?SGwcRleTL1|{=>_.LoRTZ/7h;4$< ');
define('SECURE_AUTH_SALT', 'Cnpl|z<>|sepZL%Uc1Z=qJZR1)6h4.WLSo#sZA_r8rnfj=L@D`%Vo x&O:yPemA.');
define('LOGGED_IN_SALT',   'UH)7z|G!^x!91_^8qPMt lE%>3EY/-mkpmfO%/FT3L++cpe!B;m=bKY#%ObyC*E(');
define('NONCE_SALT',       '|}W9li-z<B;jXx~y1RN1R+;,q{8)]@ZyRjL}KI t!]1LmQ%8, A!)z$[)k]10V X');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'crtr_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');
