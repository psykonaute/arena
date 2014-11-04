<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'arena');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost:80');

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
define('AUTH_KEY',         'c,wY#} v`5@+d&Q?AlC(JO=CON<xNg*N&@C6@+$;5N[by_s`7G)2N1Y]HX8j|8g`');
define('SECURE_AUTH_KEY',  'owoRNS,?,?DKXa5YN,&5X%TeydqPn5wxP%z|[P]yckOHAlrI3Gdl#PL9c<X}qEJ|');
define('LOGGED_IN_KEY',    'nn=%`f:69ma)kYsHR8ed-42Q5|:<`7A)B iBIA5+No+)(L0c7qBJ39f>~:V^#%Mq');
define('NONCE_KEY',        '|Byh(uPWFCa.CFQN}bQW;+TA_x-:;vFzS:>|pK(T;,7$EL=+/sZro&&mbph{(sCR');
define('AUTH_SALT',        '.[AG#uLqM|HPt0NaKR<q(?d_Euk(tPg:TI>R+R=*RW3iw{VscUt@exjj}U({X>Y=');
define('SECURE_AUTH_SALT', 'RMeg{~eYR/clM4+1D2,&M6hsQJ+<UBD^y#]k-M|}RPYz(H-XC{-!Js)Q;Kku-$f$');
define('LOGGED_IN_SALT',   'Qi.fzF;t8at,dcqa+@+tXEv9; X%;rbeNxZ+VR_[U&sFWR;Ar4bc-r|3E?xU;C[n');
define('NONCE_SALT',       'myn~}XR0MDW8;xi84Wh;c(zV>Mj[Cg(&I^Yf:~oBme5-$71@p|(H)Jw-AY-+M@g*');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
