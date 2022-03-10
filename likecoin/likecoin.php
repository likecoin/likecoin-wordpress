<?php
/**
 * LikeCoin WordPress Plugin
 *
 * Plugin for embbeding LikeCoin functionalities into WordPress.
 *
 * @package   LikeCoin
 * @author    LikeCoin Foundation <team@like.co>
 * @license   GPLv3
 * @link      https://github.com/likecoin/likecoin-wordpress
 * @copyright 2018 LikeCoin Foundation

 * Plugin Name:  LikeCoin
 * Plugin URI:   https://github.com/likecoin/likecoin-wordpress
 * Description:  Integrate your Liker ID, add LikeCoin Button and decentralized publishing to WordPress.
 * Version:      2.5.1
 * Author:       LikeCoin Foundation
 * Author URI:   https://like.co/
 * License:      GPLv3
 * License URI:  https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:  likecoin
 * Domain Path:  /languages/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain

define( 'LC_URI', plugin_dir_url( __FILE__ ) );
define( 'LC_DIR', plugin_dir_path( __FILE__ ) );
define( 'LC_PLUGIN_SLUG', 'likecoin' );
define( 'LC_PLUGIN_NAME', 'LikeCoin' );
define( 'LC_PLUGIN_VERSION', '2.5.1' );

require_once dirname( __FILE__ ) . '/includes/constant/options.php';
require_once dirname( __FILE__ ) . '/public/likecoin.php';
require_once dirname( __FILE__ ) . '/admin/restful.php';

/**
 * Handle plugin init and upgrade
 */
function likecoin_handle_init_and_upgrade() {
	global $wpdb;
	global $charset_collate;
	$version = get_option( 'likecoin_plugin_version', LC_PLUGIN_VERSION );

	if ( version_compare( $version, '1.1' ) < 0 ) {
		delete_metadata( 'user', 0, 'lc_widget_option', '', true );
		delete_metadata( 'user', 0, 'lc_widget_position', '', true );
	}

	if ( version_compare( $version, LC_PLUGIN_VERSION ) < 0 ) {
		update_option( 'likecoin_plugin_version', LC_PLUGIN_VERSION );
	}

}

/**
 * Handle plugin uninstall
 */
function likecoin_handle_uninstall() {

	/* clean up all user metadata */
	delete_metadata( 'user', 0, 'lc_likecoin_id', '', true );
	delete_metadata( 'user', 0, 'lc_likecoin_wallet', '', true );
	delete_metadata( 'user', 0, 'lc_likecoin_user', '', true );
	delete_metadata( 'user', 0, 'lc_widget_option', '', true );
	delete_metadata( 'user', 0, 'lc_widget_position', '', true );
	/* clean up all post metadata */
	delete_metadata( 'post', 0, 'lc_widget_option', '', true );
	delete_metadata( 'post', 0, 'lc_widget_position', '', true );
	/* clean up all option */
	delete_option( LC_BUTTON_OPTION_NAME );
	delete_option( LC_PUBLISH_OPTION_NAME );
	delete_option( LC_MONETIZATION_OPTION_NAME );
	delete_option( 'likecoin_plugin_version' );
}

/**
 * Loads localization .mo files
 */
function likecoin_load_plugin_textdomain() {
	load_plugin_textdomain( LC_PLUGIN_SLUG, false, basename( dirname( __FILE__ ) ) . '/languages/' );
}

/**
 * Add all WordPress hooks related to this plugin
 */
function likecoin_add_all_hooks() {
	if ( is_admin() ) {
		require_once dirname( __FILE__ ) . '/admin/likecoin.php';
		likecoin_add_admin_hooks();
	}
	likecoin_hook_restful_hook();
	likecoin_add_matters_hook();
	likecoin_add_public_hooks();
	register_activation_hook( __FILE__, 'likecoin_handle_init_and_upgrade' );
	add_action( 'upgrader_process_complete', 'likecoin_handle_init_and_upgrade' );
	add_action( 'init', 'likecoin_handle_init_and_upgrade' );
	add_action( 'plugins_loaded', 'likecoin_load_plugin_textdomain' );
	register_uninstall_hook( __FILE__, 'likecoin_handle_uninstall' );
}

likecoin_add_all_hooks();
